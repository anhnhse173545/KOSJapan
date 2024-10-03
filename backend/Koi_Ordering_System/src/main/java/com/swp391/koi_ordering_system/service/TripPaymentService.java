package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.model.TripPayment;
import com.swp391.koi_ordering_system.repository.TripPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TripPaymentService {

    @Autowired
    private TripPaymentRepository tripPaymentRepository;

    public TripPayment createTripPayment(TripPayment tripPayment) {
        tripPayment.setId(generateTripPaymentId());
        return tripPaymentRepository.save(tripPayment);
    }

    public List<TripPayment> getAllTripPayment() {
        return tripPaymentRepository.findAllByIsDeletedFalse();
    }

    public Optional<TripPayment> getTripPaymentById(String id) {
        return tripPaymentRepository.findByIdAndIsDeletedFalse(id);
    }

    public TripPayment updateTripPayment(String id, TripPayment tripPaymentDetails) {
        Optional<TripPayment> optionalTripPayment = tripPaymentRepository.findByIdAndIsDeletedFalse(id);
        if (optionalTripPayment.isPresent()) {
            TripPayment tripPayment = optionalTripPayment.get();

            if (tripPaymentDetails.getBooking() != null) {
                tripPayment.setBooking(tripPaymentDetails.getBooking());
            }
            if (tripPaymentDetails.getPaymentMethod() != null) {
                tripPayment.setPaymentMethod(tripPaymentDetails.getPaymentMethod());
            }
            if (tripPaymentDetails.getCreateAt() != null) {
                tripPayment.setCreateAt(tripPaymentDetails.getCreateAt());
            }
            if (tripPaymentDetails.getAmount() != null) {
                tripPayment.setAmount(tripPaymentDetails.getAmount());
            }
            if (tripPaymentDetails.getStatus() != null) {
                tripPayment.setStatus(tripPaymentDetails.getStatus());
            }
            return tripPaymentRepository.save(tripPayment);
        }
        return null;
    }

    public void deleteTripPayment(String id) {
        Optional<TripPayment> optionalTripPayment = tripPaymentRepository.findById(id);
        if (optionalTripPayment.isPresent()) {
            TripPayment tripPayment = optionalTripPayment.get();
            tripPayment.setIsDeleted(true);
            tripPaymentRepository.save(tripPayment);
        }
    }

    private String generateTripPaymentId() {
        String lastTripId = tripPaymentRepository.findTopByOrderByIdDesc()
                .map(TripPayment::getId)
                .orElse("TR0000");
        int nextId = Integer.parseInt(lastTripId.substring(2)) + 1;
        return String.format("TR%04d", nextId);
    }
}
