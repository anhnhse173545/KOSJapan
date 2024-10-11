package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.Farm;
import com.swp391.koi_ordering_system.model.Variety;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VarietyRepository extends JpaRepository<Variety, String> {
    List<Variety> findAllByIsDeletedFalse();
    Optional<Variety> findByIdAndIsDeletedFalse(String id);
    Optional<Variety> findTopByOrderByIdDesc();
}
