package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.Trip;
import com.swp391.koi_ordering_system.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @RequestMapping("/create")
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        bookingService.createBooking(booking);
        return ResponseEntity.ok(booking);
    }

    @RequestMapping("/list")
    public List<Booking> getAllBooking() {
        return bookingService.getAllBooking();
    }


    @RequestMapping("customer/{customerId}")
    public ResponseEntity<List<Booking>> getBookingsByCustomerId(@PathVariable String customerId) {
        List<Booking> bookings = bookingService.getBookingsByCustomerId(customerId);
        if (bookings.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(bookings);
    }

    @RequestMapping("/get/{id}")
    public ResponseEntity<Optional<Booking>> getBookingById(@PathVariable String id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        if (booking.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(booking);
    }

    @RequestMapping("/update/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable String id, @RequestBody Booking booking) {
        Booking updatedBooking = bookingService.updateBooking(id, booking);
        if (updatedBooking == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedBooking);
    }

    @RequestMapping ("/delete/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok("Booking deleted successfully");
    }

    @RequestMapping("/{bookingId}/create-trip")
    public ResponseEntity<Trip> createTripForBooking(@PathVariable String bookingId, @RequestBody Trip trip) {
        Trip createdTrip = bookingService.createTripForBooking(bookingId, trip);
        if (createdTrip == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(createdTrip);
    }

    @RequestMapping("/{bookingId}/trip")
    public ResponseEntity<Trip> getTripByBookingId(@PathVariable String bookingId) {
        return bookingService.getTripByBookingId(bookingId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
