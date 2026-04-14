package com.jeevanam360.backend.offer;

import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class OfferCatalogService {

    private static final String FIRST_TRIAL_TITLE = "First Trial Class";
    private static final String BEGINNER_LAUNCH_TITLE = "Beginner Yoga Launch Offer";

    private final Set<String> offerTitles = Set.of(
        FIRST_TRIAL_TITLE,
        BEGINNER_LAUNCH_TITLE,
        "Yoga + Personalized Diet Plan"
    ).stream().map(this::normalize).collect(Collectors.toSet());

    public boolean supports(String title) {
        return offerTitles.contains(normalize(title));
    }

    public boolean isNewUserOnly(String title) {
        String normalizedTitle = normalize(title);
        return normalize(FIRST_TRIAL_TITLE).equals(normalizedTitle)
            || normalize(BEGINNER_LAUNCH_TITLE).equals(normalizedTitle);
    }

    public boolean isLaunchOffer(String title) {
        return normalize(BEGINNER_LAUNCH_TITLE).equals(normalize(title));
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ENGLISH);
    }
}
