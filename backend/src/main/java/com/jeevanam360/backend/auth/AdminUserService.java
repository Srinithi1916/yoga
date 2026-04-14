package com.jeevanam360.backend.auth;

import java.util.Comparator;
import java.util.List;

import com.jeevanam360.backend.membership.MembershipRecord;
import com.jeevanam360.backend.membership.MembershipService;
import com.jeevanam360.backend.payment.PaymentRequestRecord;
import com.jeevanam360.backend.payment.PaymentRequestRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminUserService {

    private final UserAccountRepository userAccountRepository;
    private final MembershipService membershipService;
    private final PaymentRequestRepository paymentRequestRepository;

    public AdminUserService(
        UserAccountRepository userAccountRepository,
        MembershipService membershipService,
        PaymentRequestRepository paymentRequestRepository
    ) {
        this.userAccountRepository = userAccountRepository;
        this.membershipService = membershipService;
        this.paymentRequestRepository = paymentRequestRepository;
    }

    public List<AdminUserSummaryResponse> getAllUsers() {
        return userAccountRepository.findAll().stream()
            .sorted(
                Comparator.comparing(UserAccount::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder()))
                    .thenComparing(UserAccount::getName, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER))
            )
            .map(this::toResponse)
            .toList();
    }

    private AdminUserSummaryResponse toResponse(UserAccount user) {
        MembershipRecord membership = membershipService.getCurrentMembershipRecordByUserId(user.getId());
        PaymentRequestRecord latestPayment = paymentRequestRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId())
            .stream()
            .findFirst()
            .orElse(null);

        return new AdminUserSummaryResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            user.getRole(),
            user.isActive(),
            user.getCreatedAt(),
            membership != null ? membership.getPlanTitle() : null,
            membership != null ? membership.getStatus() : null,
            latestPayment != null ? latestPayment.getSelectedPlan() : null,
            latestPayment != null ? latestPayment.getPlanPrice() : null,
            latestPayment != null ? AdminUserSummaryResponse.normalizeStatus(latestPayment.getStatus()) : null
        );
    }
}
