package com.swp391.koi_ordering_system.service;

import com.paypal.api.payments.Payment;
import com.paypal.api.payments.Transaction;
import com.swp391.koi_ordering_system.dto.response.TripPaymentDTO;
import com.swp391.koi_ordering_system.mapper.TripPaymentMapper;
import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.FishOrderDetail;
import com.swp391.koi_ordering_system.model.TripPayment;
import com.swp391.koi_ordering_system.repository.BookingRepository;
import com.swp391.koi_ordering_system.repository.TripPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TripPaymentService {

    @Autowired
    private TripPaymentRepository tripPaymentRepository;

    @Autowired
    private TripPaymentMapper tripPaymentMapper;

    @Autowired
    private BookingRepository bookingRepository;

    private static final String PREFIX = "TRP";
    private static final int ID_PADDING = 4;

    public TripPayment createTripPayment(TripPayment tripPayment) {
        tripPayment.setId(generateTripPaymentId());
        return tripPaymentRepository.save(tripPayment);
    }

    public List<TripPaymentDTO> getAllTripPayment() {
        return tripPaymentRepository.findAllByIsDeletedFalse().stream()
                .map(tripPaymentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<TripPaymentDTO> getTripPaymentById(String id) {
        return tripPaymentRepository.findByIdAndIsDeletedFalse(id)
                .map(tripPaymentMapper::toDTO);
    }

    public void deleteTripPayment(String id) {
        Optional<TripPayment> optionalTripPayment = tripPaymentRepository.findById(id);
        if (optionalTripPayment.isPresent()) {
            TripPayment tripPayment = optionalTripPayment.get();
            tripPayment.setIsDeleted(true);
            tripPaymentRepository.save(tripPayment);
        }
    }

    public TripPayment createTripPaymentUsingPayPal(String bookingId){
        Optional<Booking> findbooking = bookingRepository.findById(bookingId);
        if (findbooking.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }
        Instant instant = Instant.now();
        LocalDateTime localDateTime = LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
        Booking booking = findbooking.get();
        bookingRepository.save(booking);

        TripPayment tripPayment = new TripPayment();
        tripPayment.setId(generateTripPaymentId());
        tripPayment.setPaymentMethod("PayPal");
        tripPayment.setStatus("Pending");
        tripPayment.setBooking(booking);
        tripPayment.setAmount(booking.getTrip().getPrice());
        tripPayment.setIsDeleted(false);
        tripPayment.setCreateAt(localDateTime);
        tripPaymentRepository.save(tripPayment);

        booking.setTripPayment(tripPayment);
        bookingRepository.save(booking);
        return tripPaymentRepository.save(tripPayment);
    }

    public void updateTripPaymentUsingPayPal(String bookingId){
        TripPayment tripPayment = tripPaymentRepository.findTripPaymentByBookingId(bookingId);

        tripPayment.setStatus("Paid Full");

        tripPaymentRepository.save(tripPayment);
    }

    public TripPaymentDTO mapToDTO(TripPayment tripPayment) {
        TripPaymentDTO tripPaymentDTO = new TripPaymentDTO();

        if (tripPayment == null) {
            return null;
        }

        tripPaymentDTO.setId(tripPayment.getId());
        tripPaymentDTO.setPaymentMethodName(tripPayment.getPaymentMethod());
        tripPaymentDTO.setAmount(tripPayment.getAmount());
        tripPaymentDTO.setCreated_at(tripPayment.getCreateAt());

        return tripPaymentDTO;
    }
    private String generateTripPaymentId() {
        String lastId = tripPaymentRepository.findTopByOrderByIdDesc()
                .map(TripPayment::getId)
                .orElse(PREFIX + String.format("%0" + ID_PADDING + "d", 0));
        try {
            int nextId = Integer.parseInt(lastId.substring(PREFIX.length())) + 1;
            return PREFIX + String.format("%0" + ID_PADDING + "d", nextId);

        } catch (NumberFormatException e) {
            throw new IllegalStateException("Invalid order detail ID format: " + lastId, e);
        }
    }
}
