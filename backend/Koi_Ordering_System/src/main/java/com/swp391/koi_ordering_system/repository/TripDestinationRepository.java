package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.Farm;
import com.swp391.koi_ordering_system.model.Trip;
import com.swp391.koi_ordering_system.model.TripDestination;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TripDestinationRepository extends JpaRepository<TripDestination, String> {
    List<TripDestination> findByTripIdAndIsDeletedFalse(String tripId);
    Optional<TripDestination> findByTripAndFarm(Trip trip, Farm farm);
    Optional<TripDestination> findByTrip(Trip trip);

    Optional<TripDestination> findTopByOrderByIdDesc();
    Optional<TripDestination> findByIdAndIsDeletedFalse(String id);
}