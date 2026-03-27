package com.jeevanam360.backend.membership;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "memberships")
public class MembershipRecord {

    @Id
    private String id;
    private String userId;
    private String userName;
    private String userEmail;
    private String planKey;
    private String planTitle;
    private String planDescription;
    private String planPrice;
    private int durationDays;
    private List<String> features = new ArrayList<>();
    private List<String> workflowSteps = new ArrayList<>();
    private String status;
    private Instant startAt;
    private Instant endAt;
    private Instant createdAt;
    private Instant activatedAt;
    private Instant updatedAt;
    private String paymentRequestId;
    private int targetSessions;
    private int completedSessions;
    private int baselineCompletedSessions;
    private int targetConsultations;
    private int completedConsultations;
    private int baselineCompletedConsultations;
    private int targetDietCheckIns;
    private int completedDietCheckIns;
    private int baselineCompletedDietCheckIns;
    private int targetMeditations;
    private int completedMeditations;
    private int baselineCompletedMeditations;
    private String latestNote;
    private List<MembershipDailyProgressEntry> dailyProgressEntries = new ArrayList<>();
    private List<String> sentReminderCodes = new ArrayList<>();

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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getPlanKey() {
        return planKey;
    }

    public void setPlanKey(String planKey) {
        this.planKey = planKey;
    }

    public String getPlanTitle() {
        return planTitle;
    }

    public void setPlanTitle(String planTitle) {
        this.planTitle = planTitle;
    }

    public String getPlanDescription() {
        return planDescription;
    }

    public void setPlanDescription(String planDescription) {
        this.planDescription = planDescription;
    }

    public String getPlanPrice() {
        return planPrice;
    }

    public void setPlanPrice(String planPrice) {
        this.planPrice = planPrice;
    }

    public int getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(int durationDays) {
        this.durationDays = durationDays;
    }

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }

    public List<String> getWorkflowSteps() {
        return workflowSteps;
    }

    public void setWorkflowSteps(List<String> workflowSteps) {
        this.workflowSteps = workflowSteps;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getStartAt() {
        return startAt;
    }

    public void setStartAt(Instant startAt) {
        this.startAt = startAt;
    }

    public Instant getEndAt() {
        return endAt;
    }

    public void setEndAt(Instant endAt) {
        this.endAt = endAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getActivatedAt() {
        return activatedAt;
    }

    public void setActivatedAt(Instant activatedAt) {
        this.activatedAt = activatedAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getPaymentRequestId() {
        return paymentRequestId;
    }

    public void setPaymentRequestId(String paymentRequestId) {
        this.paymentRequestId = paymentRequestId;
    }

    public int getTargetSessions() {
        return targetSessions;
    }

    public void setTargetSessions(int targetSessions) {
        this.targetSessions = targetSessions;
    }

    public int getCompletedSessions() {
        return completedSessions;
    }

    public void setCompletedSessions(int completedSessions) {
        this.completedSessions = completedSessions;
    }

    public int getBaselineCompletedSessions() {
        return baselineCompletedSessions;
    }

    public void setBaselineCompletedSessions(int baselineCompletedSessions) {
        this.baselineCompletedSessions = baselineCompletedSessions;
    }

    public int getTargetConsultations() {
        return targetConsultations;
    }

    public void setTargetConsultations(int targetConsultations) {
        this.targetConsultations = targetConsultations;
    }

    public int getCompletedConsultations() {
        return completedConsultations;
    }

    public void setCompletedConsultations(int completedConsultations) {
        this.completedConsultations = completedConsultations;
    }

    public int getBaselineCompletedConsultations() {
        return baselineCompletedConsultations;
    }

    public void setBaselineCompletedConsultations(int baselineCompletedConsultations) {
        this.baselineCompletedConsultations = baselineCompletedConsultations;
    }

    public int getTargetDietCheckIns() {
        return targetDietCheckIns;
    }

    public void setTargetDietCheckIns(int targetDietCheckIns) {
        this.targetDietCheckIns = targetDietCheckIns;
    }

    public int getCompletedDietCheckIns() {
        return completedDietCheckIns;
    }

    public void setCompletedDietCheckIns(int completedDietCheckIns) {
        this.completedDietCheckIns = completedDietCheckIns;
    }

    public int getBaselineCompletedDietCheckIns() {
        return baselineCompletedDietCheckIns;
    }

    public void setBaselineCompletedDietCheckIns(int baselineCompletedDietCheckIns) {
        this.baselineCompletedDietCheckIns = baselineCompletedDietCheckIns;
    }

    public int getTargetMeditations() {
        return targetMeditations;
    }

    public void setTargetMeditations(int targetMeditations) {
        this.targetMeditations = targetMeditations;
    }

    public int getCompletedMeditations() {
        return completedMeditations;
    }

    public void setCompletedMeditations(int completedMeditations) {
        this.completedMeditations = completedMeditations;
    }

    public int getBaselineCompletedMeditations() {
        return baselineCompletedMeditations;
    }

    public void setBaselineCompletedMeditations(int baselineCompletedMeditations) {
        this.baselineCompletedMeditations = baselineCompletedMeditations;
    }

    public String getLatestNote() {
        return latestNote;
    }

    public void setLatestNote(String latestNote) {
        this.latestNote = latestNote;
    }

    public List<MembershipDailyProgressEntry> getDailyProgressEntries() {
        return dailyProgressEntries;
    }

    public void setDailyProgressEntries(List<MembershipDailyProgressEntry> dailyProgressEntries) {
        this.dailyProgressEntries = dailyProgressEntries;
    }

    public List<String> getSentReminderCodes() {
        return sentReminderCodes;
    }

    public void setSentReminderCodes(List<String> sentReminderCodes) {
        this.sentReminderCodes = sentReminderCodes;
    }
}
