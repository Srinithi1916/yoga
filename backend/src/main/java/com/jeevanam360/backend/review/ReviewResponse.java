package com.jeevanam360.backend.review;

public record ReviewResponse(
    String id,
    String userName,
    int rating,
    String title,
    String comment,
    boolean verifiedParticipant,
    boolean mine
) {
    public static ReviewResponse from(Review review, String currentUserId) {
        return new ReviewResponse(
            review.getId(),
            review.getUserName(),
            review.getRating(),
            review.getTitle(),
            review.getComment(),
            review.isVerifiedParticipant(),
            currentUserId != null && currentUserId.equals(review.getUserId())
        );
    }
}
