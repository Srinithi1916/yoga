package com.jeevanam360.backend.notification;

import com.jeevanam360.backend.membership.MembershipService;
import com.jeevanam360.backend.payment.PaymentRequestService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ReminderScheduler {

    private final PaymentRequestService paymentRequestService;
    private final MembershipService membershipService;

    public ReminderScheduler(PaymentRequestService paymentRequestService, MembershipService membershipService) {
        this.paymentRequestService = paymentRequestService;
        this.membershipService = membershipService;
    }

    @Scheduled(cron = "${app.notifications.reminder-cron:0 0 9 * * *}", zone = "Asia/Kolkata")
    public void sendDailyReminders() {
        paymentRequestService.processPendingPaymentReminders();
        membershipService.processMembershipReminders();
    }
}
