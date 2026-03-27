package com.jeevanam360.backend.membership;

public class MembershipDailyProgressEntry {

    private String entryDate;
    private boolean sessionCompleted;
    private boolean consultationCompleted;
    private boolean dietCheckInCompleted;
    private boolean meditationCompleted;

    public String getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(String entryDate) {
        this.entryDate = entryDate;
    }

    public boolean isSessionCompleted() {
        return sessionCompleted;
    }

    public void setSessionCompleted(boolean sessionCompleted) {
        this.sessionCompleted = sessionCompleted;
    }

    public boolean isConsultationCompleted() {
        return consultationCompleted;
    }

    public void setConsultationCompleted(boolean consultationCompleted) {
        this.consultationCompleted = consultationCompleted;
    }

    public boolean isDietCheckInCompleted() {
        return dietCheckInCompleted;
    }

    public void setDietCheckInCompleted(boolean dietCheckInCompleted) {
        this.dietCheckInCompleted = dietCheckInCompleted;
    }

    public boolean isMeditationCompleted() {
        return meditationCompleted;
    }

    public void setMeditationCompleted(boolean meditationCompleted) {
        this.meditationCompleted = meditationCompleted;
    }
}
