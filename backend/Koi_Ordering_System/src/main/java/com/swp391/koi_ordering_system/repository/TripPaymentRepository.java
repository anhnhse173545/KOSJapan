package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.TripPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripPaymentRepository extends JpaRepository<TripPayment, String> {
    List<TripPayment> findAllByIsDeletedFalse();
    Optional<TripPayment> findByIdAndIsDeletedFalse(String id);
    Optional<TripPayment> findTopByOrderByIdDesc();
}
