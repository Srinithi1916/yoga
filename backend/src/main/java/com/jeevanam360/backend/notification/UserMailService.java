package com.jeevanam360.backend.notification;

import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class UserMailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserMailService.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final String brandName;
    private final String configuredFromAddress;
    private final String smtpHost;
    private final String smtpUsername;
    private final String smtpPassword;

    public UserMailService(
        ObjectProvider<JavaMailSender> mailSenderProvider,
        @Value("${app.mail.brand-name:Jeevanam 360}") String brandName,
        @Value("${app.mail.from-address:}") String configuredFromAddress,
        @Value("${spring.mail.host:}") String smtpHost,
        @Value("${spring.mail.username:}") String smtpUsername,
        @Value("${spring.mail.password:}") String smtpPassword
    ) {
        this.mailSenderProvider = mailSenderProvider;
        this.brandName = brandName;
        this.configuredFromAddress = configuredFromAddress;
        this.smtpHost = smtpHost;
        this.smtpUsername = smtpUsername;
        this.smtpPassword = smtpPassword;
    }

    @Async
    public void send(String recipient, String subject, String body) {
        if (!isConfigured() || recipient == null || recipient.isBlank()) {
            return;
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            return;
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, StandardCharsets.UTF_8.name());
            helper.setTo(recipient);
            helper.setFrom(resolveFromAddress(recipient));
            helper.setSubject(subject);
            helper.setText(body, false);
            mailSender.send(mimeMessage);
        } catch (MailException | jakarta.mail.MessagingException exception) {
            LOGGER.warn("Could not send member email to {}.", recipient, exception);
        }
    }

    public String formatSubject(String subject) {
        return brandName + " - " + subject;
    }

    private boolean isConfigured() {
        return trimToNull(smtpHost) != null && trimToNull(smtpUsername) != null && trimToNull(smtpPassword) != null;
    }

    private String resolveFromAddress(String fallback) {
        String fromAddress = trimToNull(configuredFromAddress);
        if (fromAddress != null) {
            return fromAddress;
        }

        String username = trimToNull(smtpUsername);
        return username == null ? fallback : username;
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
