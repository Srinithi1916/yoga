package com.jeevanam360.backend.membership;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import com.jeevanam360.backend.notification.NotificationService;
import com.jeevanam360.backend.notification.UserMailService;
import com.jeevanam360.backend.payment.PaymentRequestRecord;
import com.jeevanam360.backend.security.AuthenticatedUser;
import org.springframework.stereotype.Service;

@Service
public class MembershipService {

    private static final String STATUS_ACTIVE = "ACTIVE";
    private static final String STATUS_EXPIRING_SOON = "EXPIRING_SOON";
    private static final String STATUS_EXPIRED = "EXPIRED";
    private static final String STATUS_SUPERSEDED = "SUPERSEDED";
    private static final ZoneId APP_ZONE = ZoneId.of("Asia/Kolkata");

    private final MembershipRepository membershipRepository;
    private final PlanCatalogService planCatalogService;
    private final NotificationService notificationService;
    private final UserMailService userMailService;

    public MembershipService(
        MembershipRepository membershipRepository,
        PlanCatalogService planCatalogService,
        NotificationService notificationService,
        UserMailService userMailService
    ) {
        this.membershipRepository = membershipRepository;
        this.planCatalogService = planCatalogService;
        this.notificationService = notificationService;
        this.userMailService = userMailService;
    }

    public MembershipResponse getCurrentMembership(AuthenticatedUser user) {
        MembershipRecord membership = membershipRepository.findFirstByUserIdOrderByActivatedAtDesc(user.id());
        if (membership == null) {
            return null;
        }

        refreshStatus(membership);
        return MembershipResponse.from(membershipRepository.save(membership));
    }

    public MembershipResponse updateProgress(AuthenticatedUser user, MembershipProgressRequest request) {
        MembershipRecord membership = membershipRepository.findFirstByUserIdOrderByActivatedAtDesc(user.id());
        if (membership == null) {
            throw new IllegalArgumentException("No active plan was found for your account.");
        }

        refreshStatus(membership);
        if (STATUS_EXPIRED.equals(membership.getStatus()) || STATUS_SUPERSEDED.equals(membership.getStatus())) {
            membershipRepository.save(membership);
            throw new IllegalArgumentException("Your current plan is no longer active.");
        }

        if (request.entryDate() != null) {
            updateDailyProgress(membership, request);
        } else {
            applyLegacyProgressOverrides(membership, request);
        }

        membership.setUpdatedAt(Instant.now());
        return MembershipResponse.from(membershipRepository.save(membership));
    }

    public MembershipRecord activateFromPayment(PaymentRequestRecord paymentRequest) {
        PlanDefinition plan = planCatalogService.findByTitle(paymentRequest.getSelectedPlan());
        expireOpenMemberships(paymentRequest.getUserId());

        Instant now = Instant.now();
        MembershipRecord membership = new MembershipRecord();
        membership.setUserId(paymentRequest.getUserId());
        membership.setUserName(paymentRequest.getName());
        membership.setUserEmail(paymentRequest.getEmail());
        membership.setPlanKey(plan.key());
        membership.setPlanTitle(plan.title());
        membership.setPlanDescription(plan.description());
        membership.setPlanPrice(plan.priceLabel());
        membership.setDurationDays(plan.durationDays());
        membership.setFeatures(new ArrayList<>(plan.features()));
        membership.setWorkflowSteps(new ArrayList<>(plan.workflowSteps()));
        membership.setStatus(STATUS_ACTIVE);
        membership.setStartAt(now);
        membership.setEndAt(now.plus(plan.durationDays(), ChronoUnit.DAYS));
        membership.setCreatedAt(now);
        membership.setActivatedAt(now);
        membership.setUpdatedAt(now);
        membership.setPaymentRequestId(paymentRequest.getId());
        membership.setTargetSessions(plan.targetSessions());
        membership.setCompletedSessions(0);
        membership.setBaselineCompletedSessions(0);
        membership.setTargetConsultations(plan.targetConsultations());
        membership.setCompletedConsultations(0);
        membership.setBaselineCompletedConsultations(0);
        membership.setTargetDietCheckIns(plan.targetDietCheckIns());
        membership.setCompletedDietCheckIns(0);
        membership.setBaselineCompletedDietCheckIns(0);
        membership.setTargetMeditations(plan.targetMeditations());
        membership.setCompletedMeditations(0);
        membership.setBaselineCompletedMeditations(0);
        membership.setLatestNote(null);
        membership.setDailyProgressEntries(new ArrayList<>());
        membership.setSentReminderCodes(new ArrayList<>());

        MembershipRecord saved = membershipRepository.save(membership);

        notificationService.createNotification(
            saved.getUserId(),
            "Plan activated",
            saved.getPlanTitle() + " is now active on your dashboard.",
            "PLAN_ACTIVATED",
            "/dashboard",
            "membership-activated-" + saved.getId()
        );
        userMailService.send(
            saved.getUserEmail(),
            userMailService.formatSubject("Your plan is now active"),
            String.join(
                System.lineSeparator(),
                "Hello " + saved.getUserName() + ",",
                "",
                saved.getPlanTitle() + " is now active.",
                "Start Date: " + saved.getStartAt(),
                "End Date: " + saved.getEndAt(),
                "Please log in to your dashboard to track your progress."
            )
        );

        return saved;
    }

    public void processMembershipReminders() {
        List<MembershipRecord> memberships = membershipRepository.findAllByStatusInOrderByEndAtAsc(
            List.of(STATUS_ACTIVE, STATUS_EXPIRING_SOON)
        );

        for (MembershipRecord membership : memberships) {
            refreshStatus(membership);
            long daysRemaining = Math.max(0, ChronoUnit.DAYS.between(Instant.now(), membership.getEndAt()));
            List<String> codes = membership.getSentReminderCodes() == null
                ? new ArrayList<>()
                : new ArrayList<>(membership.getSentReminderCodes());

            if (STATUS_EXPIRED.equals(membership.getStatus())) {
                sendMembershipNotice(
                    membership,
                    "Plan expired",
                    "Your plan has expired. Renew to continue your guided progress.",
                    "MEMBERSHIP_EXPIRED",
                    "membership-expired-" + membership.getId(),
                    codes
                );
            } else if (daysRemaining <= 1) {
                sendMembershipNotice(
                    membership,
                    "Plan expires tomorrow",
                    "Your plan will expire within 1 day. Renew soon to keep your progress active.",
                    "MEMBERSHIP_EXPIRING",
                    "membership-expiry-1-" + membership.getId(),
                    codes
                );
            } else if (daysRemaining <= 3) {
                sendMembershipNotice(
                    membership,
                    "Plan expiring soon",
                    "Your plan will expire within 3 days. Renew early to keep continuity.",
                    "MEMBERSHIP_EXPIRING",
                    "membership-expiry-3-" + membership.getId(),
                    codes
                );
            }

            membership.setSentReminderCodes(codes);
            membershipRepository.save(membership);
        }
    }

    private void updateDailyProgress(MembershipRecord membership, MembershipProgressRequest request) {
        LocalDate selectedDate = parseDate(request.entryDate());
        validateDateInMembershipRange(membership, selectedDate);
        initializeLegacyBaselines(membership);

        List<MembershipDailyProgressEntry> entries = membership.getDailyProgressEntries() == null
            ? new ArrayList<>()
            : new ArrayList<>(membership.getDailyProgressEntries());

        MembershipDailyProgressEntry entry = findOrCreateEntry(entries, request.entryDate());
        entry.setSessionCompleted(resolveSelection(request.sessionCompleted(), entry.isSessionCompleted(), membership.getTargetSessions(), "Sessions"));
        entry.setConsultationCompleted(resolveSelection(request.consultationCompleted(), entry.isConsultationCompleted(), membership.getTargetConsultations(), "Consultations"));
        entry.setDietCheckInCompleted(resolveSelection(request.dietCheckInCompleted(), entry.isDietCheckInCompleted(), membership.getTargetDietCheckIns(), "Diet check-ins"));
        entry.setMeditationCompleted(resolveSelection(request.meditationCompleted(), entry.isMeditationCompleted(), membership.getTargetMeditations(), "Meditations"));

        entries.removeIf(existing -> request.entryDate().equals(existing.getEntryDate())
            && !existing.isSessionCompleted()
            && !existing.isConsultationCompleted()
            && !existing.isDietCheckInCompleted()
            && !existing.isMeditationCompleted());

        membership.setDailyProgressEntries(entries);
        recalculateCompletedCounts(membership);
    }

    private void applyLegacyProgressOverrides(MembershipRecord membership, MembershipProgressRequest request) {
        List<MembershipDailyProgressEntry> entries = membership.getDailyProgressEntries() == null
            ? List.of()
            : membership.getDailyProgressEntries();

        if (request.completedSessions() != null) {
            int completed = clamp(request.completedSessions(), membership.getTargetSessions());
            membership.setCompletedSessions(completed);
            membership.setBaselineCompletedSessions(Math.max(0, completed - countSelected(entries, MembershipDailyProgressEntry::isSessionCompleted)));
        }
        if (request.completedConsultations() != null) {
            int completed = clamp(request.completedConsultations(), membership.getTargetConsultations());
            membership.setCompletedConsultations(completed);
            membership.setBaselineCompletedConsultations(Math.max(0, completed - countSelected(entries, MembershipDailyProgressEntry::isConsultationCompleted)));
        }
        if (request.completedDietCheckIns() != null) {
            int completed = clamp(request.completedDietCheckIns(), membership.getTargetDietCheckIns());
            membership.setCompletedDietCheckIns(completed);
            membership.setBaselineCompletedDietCheckIns(Math.max(0, completed - countSelected(entries, MembershipDailyProgressEntry::isDietCheckInCompleted)));
        }
        if (request.completedMeditations() != null) {
            int completed = clamp(request.completedMeditations(), membership.getTargetMeditations());
            membership.setCompletedMeditations(completed);
            membership.setBaselineCompletedMeditations(Math.max(0, completed - countSelected(entries, MembershipDailyProgressEntry::isMeditationCompleted)));
        }
        if (request.latestNote() != null) {
            membership.setLatestNote(trimToNull(request.latestNote()));
        }
    }

    private MembershipDailyProgressEntry findOrCreateEntry(List<MembershipDailyProgressEntry> entries, String entryDate) {
        for (MembershipDailyProgressEntry entry : entries) {
            if (entryDate.equals(entry.getEntryDate())) {
                return entry;
            }
        }

        MembershipDailyProgressEntry entry = new MembershipDailyProgressEntry();
        entry.setEntryDate(entryDate);
        entries.add(entry);
        return entry;
    }

    private boolean resolveSelection(Boolean requested, boolean currentValue, int target, String label) {
        if (requested == null) {
            return currentValue;
        }

        if (Boolean.TRUE.equals(requested) && target <= 0) {
            throw new IllegalArgumentException(label + " are not included in your current plan.");
        }

        return Boolean.TRUE.equals(requested);
    }

    private void recalculateCompletedCounts(MembershipRecord membership) {
        List<MembershipDailyProgressEntry> entries = membership.getDailyProgressEntries() == null
            ? List.of()
            : membership.getDailyProgressEntries();

        membership.setCompletedSessions(
            clamp(membership.getBaselineCompletedSessions() + countSelected(entries, MembershipDailyProgressEntry::isSessionCompleted), membership.getTargetSessions())
        );
        membership.setCompletedConsultations(
            clamp(membership.getBaselineCompletedConsultations() + countSelected(entries, MembershipDailyProgressEntry::isConsultationCompleted), membership.getTargetConsultations())
        );
        membership.setCompletedDietCheckIns(
            clamp(membership.getBaselineCompletedDietCheckIns() + countSelected(entries, MembershipDailyProgressEntry::isDietCheckInCompleted), membership.getTargetDietCheckIns())
        );
        membership.setCompletedMeditations(
            clamp(membership.getBaselineCompletedMeditations() + countSelected(entries, MembershipDailyProgressEntry::isMeditationCompleted), membership.getTargetMeditations())
        );
    }

    private int countSelected(List<MembershipDailyProgressEntry> entries, Function<MembershipDailyProgressEntry, Boolean> selector) {
        int count = 0;
        for (MembershipDailyProgressEntry entry : entries) {
            if (Boolean.TRUE.equals(selector.apply(entry))) {
                count++;
            }
        }
        return count;
    }

    private void initializeLegacyBaselines(MembershipRecord membership) {
        List<MembershipDailyProgressEntry> entries = membership.getDailyProgressEntries();
        boolean hasEntries = entries != null && !entries.isEmpty();
        if (hasEntries) {
            return;
        }

        if (membership.getBaselineCompletedSessions() == 0 && membership.getCompletedSessions() > 0) {
            membership.setBaselineCompletedSessions(membership.getCompletedSessions());
        }
        if (membership.getBaselineCompletedConsultations() == 0 && membership.getCompletedConsultations() > 0) {
            membership.setBaselineCompletedConsultations(membership.getCompletedConsultations());
        }
        if (membership.getBaselineCompletedDietCheckIns() == 0 && membership.getCompletedDietCheckIns() > 0) {
            membership.setBaselineCompletedDietCheckIns(membership.getCompletedDietCheckIns());
        }
        if (membership.getBaselineCompletedMeditations() == 0 && membership.getCompletedMeditations() > 0) {
            membership.setBaselineCompletedMeditations(membership.getCompletedMeditations());
        }
    }

    private void validateDateInMembershipRange(MembershipRecord membership, LocalDate selectedDate) {
        if (membership.getStartAt() == null || membership.getEndAt() == null) {
            throw new IllegalArgumentException("Your plan dates are not available yet.");
        }

        LocalDate startDate = membership.getStartAt().atZone(APP_ZONE).toLocalDate();
        LocalDate endDate = membership.getEndAt().atZone(APP_ZONE).toLocalDate();
        if (selectedDate.isBefore(startDate) || selectedDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Choose a date inside your active plan period.");
        }
    }

    private LocalDate parseDate(String entryDate) {
        try {
            return LocalDate.parse(entryDate);
        } catch (DateTimeParseException exception) {
            throw new IllegalArgumentException("Choose a valid date to update progress.");
        }
    }

    private void sendMembershipNotice(
        MembershipRecord membership,
        String title,
        String message,
        String type,
        String dedupeKey,
        List<String> sentCodes
    ) {
        if (sentCodes.contains(dedupeKey)) {
            return;
        }

        notificationService.createNotification(membership.getUserId(), title, message, type, "/dashboard", dedupeKey);
        userMailService.send(
            membership.getUserEmail(),
            userMailService.formatSubject(title),
            String.join(System.lineSeparator(), "Hello " + membership.getUserName() + ",", "", message)
        );
        sentCodes.add(dedupeKey);
    }

    private void expireOpenMemberships(String userId) {
        if (userId == null || userId.isBlank()) {
            return;
        }

        List<MembershipRecord> memberships = membershipRepository.findAllByUserIdOrderByActivatedAtDesc(userId);
        Instant now = Instant.now();
        boolean changed = false;

        for (MembershipRecord membership : memberships) {
            if (STATUS_ACTIVE.equals(membership.getStatus()) || STATUS_EXPIRING_SOON.equals(membership.getStatus())) {
                membership.setStatus(STATUS_SUPERSEDED);
                membership.setUpdatedAt(now);
                changed = true;
            }
        }

        if (changed) {
            membershipRepository.saveAll(memberships);
        }
    }

    private void refreshStatus(MembershipRecord membership) {
        Instant now = Instant.now();
        if (membership.getEndAt() != null && now.isAfter(membership.getEndAt())) {
            membership.setStatus(STATUS_EXPIRED);
            membership.setUpdatedAt(now);
            return;
        }

        if (membership.getEndAt() != null && ChronoUnit.DAYS.between(now, membership.getEndAt()) <= 3) {
            membership.setStatus(STATUS_EXPIRING_SOON);
        } else if (!STATUS_SUPERSEDED.equals(membership.getStatus())) {
            membership.setStatus(STATUS_ACTIVE);
        }
    }

    private int clamp(int value, int target) {
        if (target <= 0) {
            return Math.max(0, value);
        }
        return Math.max(0, Math.min(value, target));
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
