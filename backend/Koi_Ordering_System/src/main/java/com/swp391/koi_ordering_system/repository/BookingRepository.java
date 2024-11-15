package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.Account;
import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    Optional<Booking> findByTripIdAndIsDeletedFalse(String tripId);

    List<Booking> findByStatusAndIsDeletedFalse(String status);

    Optional<Booking> findTopByOrderByIdDesc();

    List<Booking> findByCustomerIdAndIsDeletedFalse(String customerId);

    Optional<Booking> findByIdAndIsDeletedFalse(String id);

    List<Booking> findAllByIsDeletedFalse();

    List<Booking> findByStatusInAndIsDeletedFalse(List<String> statuses);

    List<Booking> findByStatusInAndCustomerIdAndIsDeletedFalse(List<String> statuses, String customerId);

    List<Booking> findBySaleStaffIdAndIsDeletedFalse(String saleStaffId);

    List<Booking> findByConsultingStaffIdAndIsDeletedFalse(String consultingStaffId);

    List<Booking> findByDeliveryStaffIdAndIsDeletedFalse(String deliveryStaffId);

    List<Booking> findBySaleStaffIdAndCustomerIdAndIsDeletedFalse(String saleStaffId, String customerId);
    List<Booking> findByTripStatusAndIsDeletedFalse(String status);
    String findCustomer_IdById(String bookingId);
}