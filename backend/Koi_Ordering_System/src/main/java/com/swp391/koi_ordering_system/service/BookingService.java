package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.Trip;
import com.swp391.koi_ordering_system.repository.BookingRepository;
import com.swp391.koi_ordering_system.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private TripService tripService;

    public Booking createBooking(Booking booking) {
        booking.setId(generateBookingId());
        return bookingRepository.save(booking);
    }

    //    public List<Booking> getAllBooking() {
//        return bookingRepository.findAll();
//    }
    public List<Booking> getAllBooking() {
        return bookingRepository.findAllByIsDeletedFalse();
    }

//    public Optional<Booking> getBookingById(String id) {
//        return bookingRepository.findById(id);
//    }
//

    public Optional<Booking> getBookingById(String id) {
        return bookingRepository.findByIdAndIsDeletedFalse(id);
    }

    public List<Booking> getBookingsByCustomerId(String customerId) {
        return bookingRepository.findByCustomerIdAndIsDeletedFalse(customerId);
    }

    public Booking updateBooking(String id, Booking bookingDetails) {
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();

            if (bookingDetails.getStatus() != null) {
                booking.setStatus(bookingDetails.getStatus());
            }
            if (bookingDetails.getSaleStaff() != null) {
                booking.setSaleStaff(bookingDetails.getSaleStaff());
            }

            if (bookingDetails.getConsultingStaff() != null) {
                booking.setConsultingStaff(bookingDetails.getConsultingStaff());
            }

            if (bookingDetails.getDeliveryStaff() != null) {
                booking.setDeliveryStaff(bookingDetails.getDeliveryStaff());
            }
            return bookingRepository.save(booking);
        }
        return null;
    }

    public Booking deleteBooking(String id) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking != null) {
            booking.setIsDeleted(true);
            return bookingRepository.save(booking);
        }
        return null;
    }

    public Trip createTripForBooking(String bookingId, Trip trip) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);
        if (bookingOptional.isPresent()) {
            trip.setBooking(bookingOptional.get());
            return tripService.createTrip(trip);
        }
        return null;
    }

    public Optional<Trip> getTripByBookingId(String bookingId) {
        return tripRepository.findByBookingIdAndBookingIsDeletedFalse(bookingId);
    }

//    public Optional<Trip> getTripByBookingId(String bookingId) {
//        Optional<Booking> booking = bookingRepository.findByIdAndIsDeletedFalse(bookingId);
//        if (booking.isPresent()) {
//            Trip trip = tripRepository.findByBookingId(bookingId);
//            if (trip != null) {
//                trip.setBooking(booking.get());
//                return Optional.of(trip);
//            }
//        }
//        return Optional.empty();
//    }

    private String generateBookingId() {
        String lastBookingId = bookingRepository.findTopByOrderByIdDesc()
                .map(Booking::getId)
                .orElse("BO0000");
        int nextId = Integer.parseInt(lastBookingId.substring(2)) + 1;
        return String.format("BO%04d", nextId);
    }


}
