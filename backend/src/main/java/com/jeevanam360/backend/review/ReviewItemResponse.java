package com.jeevanam360.backend.review;

import java.util.List;

public record ReviewItemResponse(
    ReviewSummaryResponse summary,
    List<ReviewResponse> reviews,
    ReviewResponse myReview
) {
}
