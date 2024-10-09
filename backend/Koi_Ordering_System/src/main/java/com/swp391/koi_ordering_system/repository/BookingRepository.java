package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByStatusAndIsDeletedFalse(String status);
    Optional<Booking> findTopByOrderByIdDesc();
    List<Booking> findByCustomerIdAndIsDeletedFalse(String customerId);
    Optional<Booking> findByIdAndIsDeletedFalse(String id);
    List<Booking> findAllByIsDeletedFalse();

}