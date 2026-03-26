package com.jeevanam360.backend.contact;

import java.math.BigDecimal;
import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "contact_messages")
public class ContactMessage {

    @Id
    private String id;
    private String userId;
    private String name;
    private String email;
    private String whatsapp;
    private String selectedPlan;
    private String planPrice;
    private BigDecimal amount;
    private String message;
    private String source;
    private Instant createdAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWhatsapp() {
        return whatsapp;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }

    public String getSelectedPlan() {
        return selectedPlan;
    }

    public void setSelectedPlan(String selectedPlan) {
        this.selectedPlan = selectedPlan;
    }

    public String getPlanPrice() {
        return planPrice;
    }

    public void setPlanPrice(String planPrice) {
        this.planPrice = planPrice;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
