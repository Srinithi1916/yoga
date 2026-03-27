package com.jeevanam360.backend.payment;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import com.jeevanam360.backend.membership.MembershipService;
import com.jeevanam360.backend.membership.PlanCatalogService;
import com.jeevanam360.backend.notification.NotificationService;
import com.jeevanam360.backend.notification.UserMailService;
import com.jeevanam360.backend.security.AuthenticatedUser;
import org.springframework.stereotype.Service;

@Service
public class PaymentRequestService {

    private static final String STATUS_PENDING_REVIEW = "PENDING_REVIEW";
    private static final String STATUS_APPROVED = "APPROVED";
    private static final String STATUS_REJECTED = "REJECTED";
    private static final String STATUS_PAID = "PAID";

    private final PaymentRequestRepository paymentRequestRepository;
    private final PlanCatalogService planCatalogService;
    private final MembershipService membershipService;
    private final NotificationService notificationService;
    private final UserMailService userMailService;

    public PaymentRequestService(
        PaymentRequestRepository paymentRequestRepository,
        PlanCatalogService planCatalogService,
        MembershipService membershipService,
        NotificationService notificationService,
        UserMailService userMailService
    ) {
        this.paymentRequestRepository = paymentRequestRepository;
        this.planCatalogService = planCatalogService;
        this.membershipService = membershipService;
        this.notificationService = notificationService;
        this.userMailService = userMailService;
    }

    public PaymentRequestRecord create(PaymentRequestPayload payload, AuthenticatedUser user) {
        if (!planCatalogService.supports(payload.selectedPlan())) {
            throw new IllegalArgumentException("Only membership plans can be activated through payment requests.");
        }

        PaymentRequestRecord paymentRequest = new PaymentRequestRecord();
        paymentRequest.setUserId(user != null ? user.id() : null);
        paymentRequest.setName(resolveName(payload.name(), user));
        paymentRequest.setEmail(resolveEmail(payload.email(), user));
        paymentRequest.setWhatsapp(payload.whatsapp().trim());
        paymentRequest.setSelectedPlan(payload.selectedPlan().trim());
        paymentRequest.setPlanPrice(trimToNull(payload.planPrice()));
        paymentRequest.setPaymentMethod(payload.paymentMethod().trim());
        paymentRequest.setTransactionReference(payload.transactionReference().trim());
        paymentRequest.setAmount(payload.amount());
        paymentRequest.setCurrency(resolveCurrency(payload.currency()));
        paymentRequest.setStatus(STATUS_PENDING_REVIEW);
        paymentRequest.setProvider("MANUAL");
        paymentRequest.setNote(trimToNull(payload.note()));
        paymentRequest.setCreatedAt(Instant.now());
        paymentRequest.setSentReminderCodes(new ArrayList<>());
        PaymentRequestRecord saved = paymentRequestRepository.save(paymentRequest);

        notificationService.createNotification(
            saved.getUserId(),
            "Payment submitted",
            "Your payment for " + saved.getSelectedPlan() + " is under review.",
            "PAYMENT_REVIEW",
            "/dashboard",
            "payment-submitted-" + saved.getId()
        );
        userMailService.send(
            saved.getEmail(),
            userMailService.formatSubject("Payment submitted"),
            String.join(
                System.lineSeparator(),
                "Hello " + saved.getName() + ",",
                "",
                "Your payment for " + saved.getSelectedPlan() + " has been submitted for review.",
                "Transaction reference: " + saved.getTransactionReference(),
                "You will receive another update after approval."
            )
        );

        return saved;
    }

    public List<PaymentRequestResponse> getMine(AuthenticatedUser user) {
        List<PaymentRequestRecord> records = paymentRequestRepository.findAllByUserIdOrderByCreatedAtDesc(user.id());
        return records.stream().map(PaymentRequestResponse::from).toList();
    }

    public List<PaymentRequestResponse> getAll(String status) {
        List<PaymentRequestRecord> records = status == null || status.isBlank()
            ? paymentRequestRepository.findAllByOrderByCreatedAtDesc()
            : paymentRequestRepository.findAllByStatusIgnoreCaseOrderByCreatedAtDesc(status.trim());
        return records.stream().map(PaymentRequestResponse::from).toList();
    }

    public PaymentRequestResponse updateStatus(
        String paymentRequestId,
        AdminPaymentDecisionRequest decision,
        AuthenticatedUser admin
    ) {
        String targetStatus = normalizeStatus(decision.status());
        if (targetStatus == null) {
            throw new IllegalArgumentException("Select a valid payment status.");
        }

        return switch (targetStatus) {
            case STATUS_PENDING_REVIEW -> markPending(paymentRequestId, decision, admin);
            case STATUS_APPROVED -> approve(paymentRequestId, decision, admin);
            case STATUS_REJECTED -> reject(paymentRequestId, decision, admin);
            default -> throw new IllegalArgumentException("The selected payment status is not supported.");
        };
    }

    public PaymentRequestResponse approve(String paymentRequestId, AdminPaymentDecisionRequest decision, AuthenticatedUser admin) {
        PaymentRequestRecord paymentRequest = paymentRequestRepository.findById(paymentRequestId)
            .orElseThrow(() -> new IllegalArgumentException("The payment request could not be found."));

        String currentStatus = normalizeStatus(paymentRequest.getStatus());
        String adminNote = defaultApprovalNote(decision.note());
        paymentRequest.setStatus(STATUS_APPROVED);
        paymentRequest.setReviewedBy(admin.name());
        paymentRequest.setReviewedAt(Instant.now());
        paymentRequest.setVerifiedAt(Instant.now());
        paymentRequest.setNote(appendNote(paymentRequest.getNote(), "Approved: " + adminNote));
        PaymentRequestRecord saved = paymentRequestRepository.save(paymentRequest);

        boolean shouldActivate = !STATUS_APPROVED.equals(currentStatus)
            && !STATUS_PAID.equals(currentStatus)
            && saved.getUserId() != null
            && planCatalogService.supports(saved.getSelectedPlan());
        if (shouldActivate) {
            membershipService.activateFromPayment(saved);
        }

        notificationService.createNotification(
            saved.getUserId(),
            "Payment approved",
            shouldActivate
                ? saved.getSelectedPlan() + " has been approved and activated."
                : saved.getSelectedPlan() + " payment has been approved.",
            "PAYMENT_APPROVED",
            "/dashboard",
            "payment-approved-" + saved.getId()
        );
        userMailService.send(
            saved.getEmail(),
            userMailService.formatSubject("Payment approved"),
            String.join(
                System.lineSeparator(),
                "Hello " + saved.getName() + ",",
                "",
                shouldActivate
                    ? "Your payment for " + saved.getSelectedPlan() + " has been approved and your plan is now active."
                    : "Your payment for " + saved.getSelectedPlan() + " has been approved.",
                "Admin note: " + adminNote
            )
        );

        return PaymentRequestResponse.from(saved);
    }

    public PaymentRequestResponse reject(String paymentRequestId, AdminPaymentDecisionRequest decision, AuthenticatedUser admin) {
        PaymentRequestRecord paymentRequest = paymentRequestRepository.findById(paymentRequestId)
            .orElseThrow(() -> new IllegalArgumentException("The payment request could not be found."));

        String currentStatus = normalizeStatus(paymentRequest.getStatus());
        if (STATUS_APPROVED.equals(currentStatus) || STATUS_PAID.equals(currentStatus)) {
            throw new IllegalArgumentException("Approved payments cannot be moved back to rejected from the admin page.");
        }

        String adminNote = defaultRejectionNote(decision.note());
        paymentRequest.setStatus(STATUS_REJECTED);
        paymentRequest.setReviewedBy(admin.name());
        paymentRequest.setReviewedAt(Instant.now());
        paymentRequest.setNote(appendNote(paymentRequest.getNote(), "Rejected: " + adminNote));
        PaymentRequestRecord saved = paymentRequestRepository.save(paymentRequest);

        notificationService.createNotification(
            saved.getUserId(),
            "Payment needs attention",
            "Your payment for " + saved.getSelectedPlan() + " was not approved. Please review the admin note.",
            "PAYMENT_REJECTED",
            "/dashboard",
            "payment-rejected-" + saved.getId()
        );
        userMailService.send(
            saved.getEmail(),
            userMailService.formatSubject("Payment needs attention"),
            String.join(
                System.lineSeparator(),
                "Hello " + saved.getName() + ",",
                "",
                "Your payment for " + saved.getSelectedPlan() + " was not approved yet.",
                "Admin note: " + adminNote,
                "Please update your payment details and submit again."
            )
        );

        return PaymentRequestResponse.from(saved);
    }

    public PaymentRequestResponse markPending(String paymentRequestId, AdminPaymentDecisionRequest decision, AuthenticatedUser admin) {
        PaymentRequestRecord paymentRequest = paymentRequestRepository.findById(paymentRequestId)
            .orElseThrow(() -> new IllegalArgumentException("The payment request could not be found."));

        String currentStatus = normalizeStatus(paymentRequest.getStatus());
        if (STATUS_APPROVED.equals(currentStatus) || STATUS_PAID.equals(currentStatus)) {
            throw new IllegalArgumentException("Approved payments cannot be moved back to pending from the admin page.");
        }

        String adminNote = defaultPendingNote(decision.note());
        paymentRequest.setStatus(STATUS_PENDING_REVIEW);
        paymentRequest.setReviewedBy(admin.name());
        paymentRequest.setReviewedAt(Instant.now());
        paymentRequest.setNote(appendNote(paymentRequest.getNote(), "Pending review: " + adminNote));
        PaymentRequestRecord saved = paymentRequestRepository.save(paymentRequest);

        notificationService.createNotification(
            saved.getUserId(),
            "Payment under review",
            "Your payment for " + saved.getSelectedPlan() + " is under review again.",
            "PAYMENT_REVIEW",
            "/dashboard",
            "payment-pending-" + saved.getId()
        );
        userMailService.send(
            saved.getEmail(),
            userMailService.formatSubject("Payment under review"),
            String.join(
                System.lineSeparator(),
                "Hello " + saved.getName() + ",",
                "",
                "Your payment for " + saved.getSelectedPlan() + " is under review.",
                "Admin note: " + adminNote
            )
        );

        return PaymentRequestResponse.from(saved);
    }

    public PaymentRequestRecord createRazorpayOrderRecord(RazorpayOrderRequest payload, String gatewayOrderId) {
        PaymentRequestRecord paymentRequest = new PaymentRequestRecord();
        paymentRequest.setName(trimToNull(payload.customerName()));
        paymentRequest.setEmail(trimToNull(payload.customerEmail()));
        paymentRequest.setWhatsapp(trimToNull(payload.customerWhatsapp()));
        paymentRequest.setSelectedPlan(payload.selectedPlan().trim());
        paymentRequest.setPlanPrice(trimToNull(payload.planPrice()));
        paymentRequest.setPaymentMethod("RAZORPAY");
        paymentRequest.setTransactionReference(gatewayOrderId);
        paymentRequest.setAmount(payload.amount());
        paymentRequest.setCurrency(resolveCurrency(payload.currency()));
        paymentRequest.setStatus("CREATED");
        paymentRequest.setProvider("RAZORPAY");
        paymentRequest.setGatewayOrderId(gatewayOrderId);
        paymentRequest.setNote("Created from Razorpay checkout.");
        paymentRequest.setCreatedAt(Instant.now());
        paymentRequest.setSentReminderCodes(new ArrayList<>());
        return paymentRequestRepository.save(paymentRequest);
    }

    public PaymentRequestRecord markRazorpayPaymentVerified(
        String gatewayOrderId,
        String gatewayPaymentId,
        String gatewaySignature
    ) {
        PaymentRequestRecord paymentRequest = paymentRequestRepository.findByGatewayOrderId(gatewayOrderId)
            .orElseThrow(() -> new IllegalArgumentException("No payment record was found for the Razorpay order."));

        paymentRequest.setGatewayPaymentId(trimToNull(gatewayPaymentId));
        paymentRequest.setGatewaySignature(trimToNull(gatewaySignature));
        paymentRequest.setStatus(STATUS_PAID);
        paymentRequest.setVerifiedAt(Instant.now());
        PaymentRequestRecord saved = paymentRequestRepository.save(paymentRequest);
        if (saved.getUserId() != null && planCatalogService.supports(saved.getSelectedPlan())) {
            membershipService.activateFromPayment(saved);
        }
        return saved;
    }

    public void processPendingPaymentReminders() {
        List<PaymentRequestRecord> records = paymentRequestRepository.findAllByStatusIgnoreCaseOrderByCreatedAtDesc(STATUS_PENDING_REVIEW);
        Instant now = Instant.now();

        for (PaymentRequestRecord paymentRequest : records) {
            long ageInDays = Math.max(0, ChronoUnit.DAYS.between(paymentRequest.getCreatedAt(), now));
            List<String> reminderCodes = paymentRequest.getSentReminderCodes() == null
                ? new ArrayList<>()
                : new ArrayList<>(paymentRequest.getSentReminderCodes());

            if (ageInDays >= 3) {
                sendReminder(paymentRequest, reminderCodes, "payment-reminder-3-" + paymentRequest.getId(), "Payment reminder", "Your payment request is still waiting for review. Please stay available for confirmation.");
            } else if (ageInDays >= 1) {
                sendReminder(paymentRequest, reminderCodes, "payment-reminder-1-" + paymentRequest.getId(), "Payment reminder", "Your payment request is under review. We will update you soon.");
            }

            paymentRequest.setSentReminderCodes(reminderCodes);
            paymentRequestRepository.save(paymentRequest);
        }
    }

    private void sendReminder(
        PaymentRequestRecord paymentRequest,
        List<String> reminderCodes,
        String reminderCode,
        String title,
        String message
    ) {
        if (reminderCodes.contains(reminderCode)) {
            return;
        }

        notificationService.createNotification(paymentRequest.getUserId(), title, message, "PAYMENT_REMINDER", "/dashboard", reminderCode);
        userMailService.send(
            paymentRequest.getEmail(),
            userMailService.formatSubject(title),
            String.join(System.lineSeparator(), "Hello " + paymentRequest.getName() + ",", "", message)
        );
        reminderCodes.add(reminderCode);
    }

    private String defaultApprovalNote(String note) {
        String normalized = trimToNull(note);
        return normalized == null ? "Approved by admin." : normalized;
    }

    private String defaultRejectionNote(String note) {
        String normalized = trimToNull(note);
        return normalized == null ? "Please review the payment details and submit again." : normalized;
    }

    private String defaultPendingNote(String note) {
        String normalized = trimToNull(note);
        return normalized == null ? "Waiting for final review." : normalized;
    }

    private String appendNote(String existingNote, String update) {
        String normalizedExisting = trimToNull(existingNote);
        String normalizedUpdate = trimToNull(update);
        if (normalizedExisting == null) {
            return normalizedUpdate;
        }
        if (normalizedUpdate == null) {
            return normalizedExisting;
        }
        return normalizedExisting + System.lineSeparator() + normalizedUpdate;
    }

    private String normalizeStatus(String status) {
        String normalized = trimToNull(status);
        return normalized == null ? null : normalized.toUpperCase(Locale.ENGLISH);
    }

    private String resolveCurrency(String currency) {
        String normalized = trimToNull(currency);
        return normalized == null ? "INR" : normalized;
    }

    private String resolveName(String payloadName, AuthenticatedUser user) {
        String normalized = trimToNull(payloadName);
        if (user != null) {
            return user.name();
        }
        return normalized;
    }

    private String resolveEmail(String payloadEmail, AuthenticatedUser user) {
        String normalized = trimToNull(payloadEmail);
        if (user != null) {
            return user.email();
        }
        return normalized;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
