package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, String> {
    Trip findByBookingIdAndIsDeletedFalse(String bookingId);
    Optional<Trip> findTopByOrderByIdDesc();
    Optional<Trip> findByIdAndIsDeletedFalse(String id);
    List<Trip> findAllByIsDeletedFalse();
    List<Trip> findTripsByBookingId(String bookingId);
    Optional<Trip> findByBookingIdAndBookingIsDeletedFalse(String bookingId);
    List<Trip> findByStatusAndIsDeletedFalse(String status);
}
