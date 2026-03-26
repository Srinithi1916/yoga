package com.jeevanam360.backend.review;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByItemId(String itemId);

    List<Review> findByItemIdIn(Collection<String> itemIds);

    Optional<Review> findByItemIdAndUserId(String itemId, String userId);

    List<Review> findByUserId(String userId);
}
