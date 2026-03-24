package com.jeevanam360.backend.contact;

import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class ContactNotificationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ContactNotificationService.class);
    private static final DateTimeFormatter SUBMITTED_AT_FORMATTER = DateTimeFormatter
        .ofPattern("dd MMM yyyy, hh:mm a")
        .withZone(ZoneId.of("Asia/Kolkata"));

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final String brandName;
    private final String contactRecipient;
    private final String configuredFromAddress;
    private final String smtpHost;
    private final String smtpUsername;
    private final String smtpPassword;

    public ContactNotificationService(
        ObjectProvider<JavaMailSender> mailSenderProvider,
        @Value("${app.mail.brand-name:Jeevanam 360}") String brandName,
        @Value("${app.mail.contact-recipient:srinithisrinithi09@gmail.com}") String contactRecipient,
        @Value("${app.mail.from-address:}") String configuredFromAddress,
        @Value("${spring.mail.host:}") String smtpHost,
        @Value("${spring.mail.username:}") String smtpUsername,
        @Value("${spring.mail.password:}") String smtpPassword
    ) {
        this.mailSenderProvider = mailSenderProvider;
        this.brandName = brandName;
        this.contactRecipient = contactRecipient;
        this.configuredFromAddress = configuredFromAddress;
        this.smtpHost = smtpHost;
        this.smtpUsername = smtpUsername;
        this.smtpPassword = smtpPassword;
    }

    public ContactEmailResult sendContactNotification(ContactMessage message) {
        if (!isMailConfigured()) {
            return new ContactEmailResult(false, "Backend email is not configured yet.");
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            return new ContactEmailResult(false, "Backend email sender is not available.");
        }

        String recipient = trimToNull(contactRecipient);
        if (recipient == null) {
            return new ContactEmailResult(false, "Backend contact recipient email is missing.");
        }

        String fromAddress = resolveFromAddress(recipient);

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                false,
                StandardCharsets.UTF_8.name()
            );
            helper.setTo(recipient);
            helper.setFrom(fromAddress);
            helper.setReplyTo(message.getEmail());
            helper.setSubject("New Jeevanam 360 enquiry from " + message.getName());
            helper.setText(buildMessageBody(message), false);
            mailSender.send(mimeMessage);
            return new ContactEmailResult(true, "Private email notification sent by the backend.");
        } catch (MailAuthenticationException exception) {
            LOGGER.error("SMTP authentication failed while sending enquiry notification.", exception);
            return new ContactEmailResult(
                false,
                "Enquiry saved, but backend email login failed. Check MAIL_USERNAME and MAIL_PASSWORD on Render."
            );
        } catch (MailSendException exception) {
            LOGGER.error("SMTP server rejected the enquiry notification.", exception);
            return new ContactEmailResult(
                false,
                "Enquiry saved, but the SMTP server rejected the message. Check MAIL_FROM and CONTACT_RECEIVER_EMAIL."
            );
        } catch (MailException | MessagingException exception) {
            LOGGER.error("SMTP delivery failed while sending enquiry notification.", exception);
            return new ContactEmailResult(
                false,
                "Enquiry saved, but backend email connection failed. Check MAIL_HOST, MAIL_PORT, and TLS settings."
            );
        }
    }

    private boolean isMailConfigured() {
        return trimToNull(smtpHost) != null
            && trimToNull(smtpUsername) != null
            && trimToNull(smtpPassword) != null;
    }

    private String buildMessageBody(ContactMessage message) {
        String selectedPlan = message.getSelectedPlan() == null ? "General enquiry" : message.getSelectedPlan();
        String planPrice = message.getPlanPrice() == null ? "To be discussed" : message.getPlanPrice();
        String amount = message.getAmount() == null ? "TBD" : message.getAmount().toPlainString();
        String submittedAt = SUBMITTED_AT_FORMATTER.format(message.getCreatedAt());

        return String.join(
            System.lineSeparator(),
            brandName + " website enquiry",
            "",
            "Name: " + message.getName(),
            "Email: " + message.getEmail(),
            "WhatsApp: " + message.getWhatsapp(),
            "Plan / Program: " + selectedPlan,
            "Price / Duration: " + planPrice,
            "Amount: " + amount,
            "Submitted At: " + submittedAt,
            "Source: " + message.getSource(),
            "",
            "Message:",
            message.getMessage()
        );
    }

    private String resolveFromAddress(String fallbackRecipient) {
        String fromAddress = trimToNull(configuredFromAddress);
        if (fromAddress != null) {
            return fromAddress;
        }

        String username = trimToNull(smtpUsername);
        return username == null ? fallbackRecipient : username;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
