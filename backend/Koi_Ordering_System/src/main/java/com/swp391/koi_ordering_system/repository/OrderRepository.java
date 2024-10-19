package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.FishOrder;
import com.swp391.koi_ordering_system.dto.request.CreateFishOrderDTO;
import com.swp391.koi_ordering_system.model.FishPack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<FishOrder, String> {
    List<FishOrder> findAllByIsDeletedFalse();
    List<FishOrder> findAllByBookingIdAndIsDeletedFalse(String id);
    Optional<FishOrder> findTopByOrderByIdDesc();
    List<FishOrder> findByBookingIdAndFarmId(String bookingId, String farmId);
    Optional<FishOrder> findFishOrderByBookingId(String id);
    Optional<FishOrder> findFishOrderByBookingIdAndFarmIdAndIsDeletedFalse(String bookingId, String farmId);
    List<FishOrder> findByBooking_DeliveryStaff_Id(String deliveryStaffId);
    List<FishOrder> findByBooking_Customer_Id(String customerId);
    List<FishOrder> findByBooking_DeliveryStaff_IdAndStatusAndIsDeletedFalse(String deliveryStaffId, String status);
}
