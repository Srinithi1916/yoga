package com.jeevanam360.backend.review;

public record ReviewSummaryResponse(
    String itemId,
    double averageRating,
    long totalReviews,
    long fiveStarCount,
    long fourStarCount,
    long threeStarCount,
    long twoStarCount,
    long oneStarCount
) {
}
