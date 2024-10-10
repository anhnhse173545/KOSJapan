package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.FishPack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FishPackRepository extends JpaRepository<FishPack, String> {
    Optional<FishPack> findTopByOrderByIdDesc();
}
