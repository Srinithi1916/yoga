package com.jeevanam360.backend.review;

import java.util.Arrays;
import java.util.List;

import com.jeevanam360.backend.security.AuthenticatedUser;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/summaries")
    public ResponseEntity<List<ReviewSummaryResponse>> getSummaries(@RequestParam(name = "itemIds") String itemIds) {
        List<String> ids = Arrays.stream(itemIds.split(","))
            .map(String::trim)
            .filter(value -> !value.isEmpty())
            .toList();

        return ResponseEntity.ok(reviewService.getSummaries(ids));
    }

    @GetMapping("/items/{itemId}")
    public ResponseEntity<ReviewItemResponse> getItemReviews(
        @PathVariable String itemId,
        Authentication authentication
    ) {
        String currentUserId = authentication != null && authentication.getPrincipal() instanceof AuthenticatedUser authenticatedUser
            ? authenticatedUser.id()
            : null;
        return ResponseEntity.ok(reviewService.getItemReviews(itemId, currentUserId));
    }

    @PostMapping("/items/{itemId}")
    public ResponseEntity<ReviewItemResponse> upsertReview(
        @PathVariable String itemId,
        @Valid @RequestBody ReviewWriteRequest request,
        Authentication authentication
    ) {
        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        return ResponseEntity.ok(reviewService.upsertReview(itemId, request, user));
    }

    @DeleteMapping("/items/{itemId}/mine")
    public ResponseEntity<Void> deleteOwnReview(@PathVariable String itemId, Authentication authentication) {
        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        reviewService.deleteOwnReview(itemId, user);
        return ResponseEntity.noContent().build();
    }
}
