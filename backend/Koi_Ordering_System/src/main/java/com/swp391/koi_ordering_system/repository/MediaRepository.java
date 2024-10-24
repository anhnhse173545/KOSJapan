package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.Media;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MediaRepository extends JpaRepository<Media, String> {
    Optional<Media> findByUrl(String id);
    Optional<Media> findTopByOrderByIdDesc();
}
