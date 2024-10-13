package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.Fish;
import com.swp391.koi_ordering_system.model.FishOrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FishOrderDetailRepository extends JpaRepository<FishOrderDetail, String> {
    Optional<FishOrderDetail> findTopByOrderByIdDesc();
    List<FishOrderDetail> findByFishOrderId(String id);
    Optional<FishOrderDetail>findFishOrderDetailByFishOrderId(String id);
}
