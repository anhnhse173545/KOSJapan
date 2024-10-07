package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.CreateBookingDTO;
import com.swp391.koi_ordering_system.dto.request.CreateTripDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateBookingDTO;
import com.swp391.koi_ordering_system.dto.response.BookingDTO;
import com.swp391.koi_ordering_system.dto.response.FishOrderDTO;
import com.swp391.koi_ordering_system.dto.response.TripDTO;
import com.swp391.koi_ordering_system.mapper.BookingMapper;
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

    @Autowired
    private BookingMapper bookingMapper;

    @RequestMapping("/create")
    public ResponseEntity<BookingDTO> createBooking(@RequestBody CreateBookingDTO createBookingDTO) {
        Booking booking = bookingMapper.toEntity(createBookingDTO);
        return ResponseEntity.ok(bookingMapper.toDTO(bookingService.createBooking(booking)));
    }
    @RequestMapping("/list")
    public ResponseEntity<List<BookingDTO>> getAllBooking() {
        return ResponseEntity.ok(bookingService.getAllBooking());
    }

    @RequestMapping("customer/{customerId}")
    public ResponseEntity<List<BookingDTO>> getBookingsByCustomerId(@PathVariable String customerId) {
        List<BookingDTO> bookings = bookingService.getBookingsByCustomerId(customerId);
        if (bookings.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(bookings);
    }

    @RequestMapping("/get/{id}")
    public ResponseEntity<Optional<BookingDTO>> getBookingById(@PathVariable String id) {
        Optional<BookingDTO> booking = bookingService.getBookingById(id);
        if (booking.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(booking);
    }

    @RequestMapping("/update/{id}")
    public ResponseEntity<BookingDTO> updateBooking(@PathVariable String id, @RequestBody UpdateBookingDTO updateBookingDTO) {
        Booking updatedBooking = bookingService.updateBooking(id, updateBookingDTO);
        if (updatedBooking == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(bookingMapper.toDTO(updatedBooking));
    }

    @RequestMapping ("/delete/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok("Booking deleted successfully");
    }

    @RequestMapping("/{bookingId}/create-trip")
    public ResponseEntity<TripDTO> createTripForBooking(@PathVariable String bookingId, @RequestBody CreateTripDTO createTripDTO) {
        TripDTO createdTrip = bookingService.createTripForBooking(bookingId, createTripDTO);
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

    @RequestMapping("/get-fish-orders/{booking_id}")
    public ResponseEntity<List<FishOrderDTO>> getFishOrdersByBookingId(@PathVariable String booking_id){
        List<FishOrderDTO> fishOrderDTOList = bookingService.getAllFishOrderByBookingId(booking_id);
        if(fishOrderDTOList.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(fishOrderDTOList);
    }
}
