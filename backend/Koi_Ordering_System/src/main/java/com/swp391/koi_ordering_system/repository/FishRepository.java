package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.Fish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FishRepository extends JpaRepository<Fish, String> {
}
