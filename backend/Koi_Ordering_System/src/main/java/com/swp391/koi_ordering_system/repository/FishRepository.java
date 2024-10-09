package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.Fish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FishRepository extends JpaRepository<Fish, String> {
    List<Fish> findAll();
    List<Fish> findByVarietyId(String fishName);
    Optional<Fish> findTopByOrderByIdDesc();
    Fish findFishById(String id);
}
