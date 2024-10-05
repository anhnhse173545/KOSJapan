package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.Farm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FarmRepository extends JpaRepository<Farm, String> {
    List<Farm> findAllByIsDeletedFalse();
    Optional<Farm> findByIdAndIsDeletedFalse(String id);
    Optional<Farm> findTopByOrderByIdDesc();
}
