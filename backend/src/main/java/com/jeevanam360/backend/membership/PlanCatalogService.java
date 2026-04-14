package com.jeevanam360.backend.membership;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class PlanCatalogService {

    private final List<PlanDefinition> plans = List.of(
        new PlanDefinition(
            "BEGINNER_PLAN",
            "Beginner Plan",
            "Yoga classes with weekly consultation for a steady start.",
            "30 Days - Rs. 1999",
            30,
            List.of("Guided yoga classes", "Weekly consultation", "Simple routine support", "Dashboard progress tracking"),
            List.of("Join your guided yoga class", "Track daily practice", "Attend weekly consultation", "Review your progress each week"),
            30,
            4,
            0,
            0
        ),
        new PlanDefinition(
            "INTERMEDIATE_PLAN",
            "Intermediate Plan",
            "Yoga classes with a diet plan for stronger daily discipline.",
            "30 Days - Rs. 3499",
            30,
            List.of("Guided yoga classes", "Diet plan", "Daily food follow-up", "Dashboard progress tracking"),
            List.of("Follow the yoga schedule", "Check in with your diet plan", "Update your dashboard daily", "Complete your guided follow-up"),
            30,
            4,
            30,
            0
        ),
        new PlanDefinition(
            "ADVANCED_PLAN",
            "Advanced Plan",
            "Yoga, personalized meditation, and diet support in one guided plan.",
            "60 Days - Rs. 6499",
            60,
            List.of("Personalized yoga", "Personalized meditation", "Diet guidance", "Progress review"),
            List.of("Complete your yoga practice", "Do your meditation routine", "Log diet consistency", "Review your guided progress"),
            60,
            8,
            60,
            60
        ),
        new PlanDefinition(
            "PREMIUM_WELLNESS_PLAN",
            "Premium Wellness Plan",
            "Full personal guidance with yoga, meditation, yoga nidra, diet, and weekly consultation.",
            "Rs. 3000 / Month",
            30,
            List.of("Personalized yoga", "Diet plan", "Weekly consultation", "Meditation support", "Yoga nidra", "Choice-based yoga path"),
            List.of("Follow your personalized yoga flow", "Track diet and wellness goals", "Complete meditation or yoga nidra", "Attend weekly review and consultation"),
            30,
            4,
            30,
            30
        )
    );

    private final Map<String, PlanDefinition> plansByTitle = plans.stream()
        .collect(Collectors.toMap(plan -> normalize(plan.title()), Function.identity()));

    public List<PlanDefinition> getPlans() {
        return plans;
    }

    public PlanDefinition findByTitle(String title) {
        PlanDefinition plan = plansByTitle.get(normalize(title));
        if (plan == null) {
            throw new IllegalArgumentException("The selected plan is not supported for activation.");
        }
        return plan;
    }

    public boolean supports(String title) {
        return plansByTitle.containsKey(normalize(title));
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ENGLISH);
    }
}
