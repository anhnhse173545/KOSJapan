package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.FishOrder;
import com.swp391.koi_ordering_system.dto.request.CreateFishOrderDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<FishOrder, String> {
    List<FishOrder> findByBookingId(String id);
    List<FishOrder> findAllByBookingId(String id);
    FishOrder findFishOrderById(String id);
}
