package com.jeevanam360.backend.review;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.jeevanam360.backend.contact.ContactMessageRepository;
import com.jeevanam360.backend.payment.PaymentRequestRepository;
import com.jeevanam360.backend.security.AuthenticatedUser;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    private static final List<String> VERIFIED_PAYMENT_STATUSES = List.of("APPROVED", "PAID");

    private final ReviewRepository reviewRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final PaymentRequestRepository paymentRequestRepository;

    public ReviewService(
        ReviewRepository reviewRepository,
        ContactMessageRepository contactMessageRepository,
        PaymentRequestRepository paymentRequestRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.paymentRequestRepository = paymentRequestRepository;
    }

    public ReviewItemResponse getItemReviews(String itemId, String currentUserId) {
        List<Review> reviews = sortedReviews(reviewRepository.findByItemId(itemId));
        ReviewSummaryResponse summary = buildSummary(itemId, reviews);
        ReviewResponse myReview = currentUserId == null
            ? null
            : reviewRepository.findByItemIdAndUserId(itemId, currentUserId)
                .map(review -> ReviewResponse.from(review, currentUserId))
                .orElse(null);

        List<ReviewResponse> reviewResponses = reviews.stream()
            .map(review -> ReviewResponse.from(review, currentUserId))
            .toList();

        return new ReviewItemResponse(summary, reviewResponses, myReview);
    }

    public List<ReviewSummaryResponse> getSummaries(Collection<String> itemIds) {
        if (itemIds == null || itemIds.isEmpty()) {
            return List.of();
        }

        List<String> orderedIds = itemIds.stream().filter(id -> id != null && !id.isBlank()).distinct().toList();
        Map<String, List<Review>> reviewsByItem = reviewRepository.findByItemIdIn(orderedIds).stream()
            .collect(Collectors.groupingBy(Review::getItemId));

        List<ReviewSummaryResponse> summaries = new ArrayList<>();
        for (String itemId : orderedIds) {
            summaries.add(buildSummary(itemId, reviewsByItem.getOrDefault(itemId, List.of())));
        }
        return summaries;
    }

    public ReviewItemResponse upsertReview(String itemId, ReviewWriteRequest request, AuthenticatedUser user) {
        Review review = reviewRepository.findByItemIdAndUserId(itemId, user.id()).orElseGet(Review::new);
        review.setItemId(itemId);
        review.setItemName(request.itemName().trim());
        review.setItemType(request.itemType().trim());
        review.setUserId(user.id());
        review.setUserName(user.name());
        review.setUserEmail(user.email());
        review.setRating(request.rating());
        review.setTitle(request.title().trim());
        review.setComment(request.comment().trim());
        review.setVerifiedParticipant(hasVerifiedParticipation(user, review.getItemName()));
        reviewRepository.save(review);

        return getItemReviews(itemId, user.id());
    }

    public void deleteOwnReview(String itemId, AuthenticatedUser user) {
        reviewRepository.findByItemIdAndUserId(itemId, user.id()).ifPresent(reviewRepository::delete);
    }

    private boolean hasVerifiedParticipation(AuthenticatedUser user, String itemName) {
        return contactMessageRepository.existsByUserIdAndSelectedPlanIgnoreCase(user.id(), itemName)
            || contactMessageRepository.existsByEmailIgnoreCaseAndSelectedPlanIgnoreCase(user.email(), itemName)
            || paymentRequestRepository.existsByUserIdAndSelectedPlanIgnoreCaseAndStatusIn(
                user.id(),
                itemName,
                VERIFIED_PAYMENT_STATUSES
            )
            || paymentRequestRepository.existsByEmailIgnoreCaseAndSelectedPlanIgnoreCaseAndStatusIn(
                user.email(),
                itemName,
                VERIFIED_PAYMENT_STATUSES
            );
    }

    private List<Review> sortedReviews(List<Review> reviews) {
        Comparator<Review> comparator = Comparator
            .comparing(Review::isVerifiedParticipant, Comparator.reverseOrder())
            .thenComparing(Review::getRating, Comparator.reverseOrder())
            .thenComparing(Review::getUserName, String.CASE_INSENSITIVE_ORDER);

        return reviews.stream().sorted(comparator).toList();
    }

    private ReviewSummaryResponse buildSummary(String itemId, List<Review> reviews) {
        Map<Integer, Long> counts = new LinkedHashMap<>();
        counts.put(5, 0L);
        counts.put(4, 0L);
        counts.put(3, 0L);
        counts.put(2, 0L);
        counts.put(1, 0L);

        reviews.forEach(review -> counts.computeIfPresent(review.getRating(), (key, value) -> value + 1));

        double average = reviews.isEmpty()
            ? 0.0
            : Math.round((reviews.stream().mapToInt(Review::getRating).average().orElse(0.0)) * 10.0) / 10.0;

        return new ReviewSummaryResponse(
            itemId,
            average,
            reviews.size(),
            counts.get(5),
            counts.get(4),
            counts.get(3),
            counts.get(2),
            counts.get(1)
        );
    }
}
