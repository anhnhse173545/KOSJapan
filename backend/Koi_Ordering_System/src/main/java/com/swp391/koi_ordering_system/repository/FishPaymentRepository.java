package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.FishPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FishPaymentRepository extends JpaRepository<FishPayment, String> {
    Optional<FishPayment> findTopByOrderByIdDesc();
    FishPayment findFishPaymentByFishOrderId(String fishOrderId);
}
