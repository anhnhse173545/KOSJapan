package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.FishPackOrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FishPackOrderDetailRepository extends JpaRepository<FishPackOrderDetail, String> {
    Optional<FishPackOrderDetail> findTopByOrderByIdDesc();
    Optional<FishPackOrderDetail> findByFishOrderId(String fishOrderId);
    List<FishPackOrderDetail> findFishPackOrderDetailsByFishOrderId(String id);
}
