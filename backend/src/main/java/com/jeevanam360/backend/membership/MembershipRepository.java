package com.jeevanam360.backend.membership;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface MembershipRepository extends MongoRepository<MembershipRecord, String> {

    MembershipRecord findFirstByUserIdOrderByActivatedAtDesc(String userId);

    List<MembershipRecord> findAllByUserIdOrderByActivatedAtDesc(String userId);

    List<MembershipRecord> findAllByStatusInOrderByEndAtAsc(List<String> statuses);
}
