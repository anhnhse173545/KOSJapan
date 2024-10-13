package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.CreateBookingDTO;
import com.swp391.koi_ordering_system.dto.request.CreateTripDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateBookingDTO;
import com.swp391.koi_ordering_system.dto.response.BookingDTO;
import com.swp391.koi_ordering_system.dto.response.ErrorDTO;
//import com.swp391.koi_ordering_system.dto.response.FishOrderDTO;
import com.swp391.koi_ordering_system.dto.response.TripDTO;
import com.swp391.koi_ordering_system.mapper.BookingMapper;
import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.Trip;
import com.swp391.koi_ordering_system.service.BookingService;
import jakarta.validation.Valid;
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


    @PostMapping("/create")
    public ResponseEntity<BookingDTO> createBooking(@Valid @RequestBody CreateBookingDTO createBookingDTO) {
        Booking booking = bookingMapper.toEntity(createBookingDTO);
        return ResponseEntity.ok(bookingMapper.toDTO(bookingService.createBooking(booking)));
    }

    @GetMapping("/list")
    public ResponseEntity<List<BookingDTO>> getAllBooking() {
        return ResponseEntity.ok(bookingService.getAllBooking());
    }

    @GetMapping("/requested")
    public ResponseEntity<List<BookingDTO>> getBookingsByStatusRequested() {
        List<BookingDTO> bookings = bookingService.getBookingsByStatusRequested();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getBookingsByCustomerId(@PathVariable String customerId) {
        List<BookingDTO> bookings = bookingService.getBookingsByCustomerId(customerId);
        if (bookings.isEmpty()) {
            ErrorDTO errorDTO = new ErrorDTO(404, "Booking not found");
            return ResponseEntity.status(404).body(errorDTO);
        }
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable String id) {
        Optional<BookingDTO> booking = bookingService.getBookingById(id);
        if (booking.isEmpty()) {
            ErrorDTO errorDTO = new ErrorDTO(404, "Booking not found");
            return ResponseEntity.status(404).body(errorDTO);
        }
        return ResponseEntity.ok(booking);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<BookingDTO> updateBooking(@PathVariable String id, @Valid @RequestBody UpdateBookingDTO updateBookingDTO) {
        BookingDTO updatedBookingDTO = bookingService.updateBooking(id, updateBookingDTO);
        if (updatedBookingDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedBookingDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok("Booking deleted successfully");
    }

    @PostMapping("/{bookingId}/create-trip")
    public ResponseEntity<TripDTO> createTripForBooking(@PathVariable String bookingId, @Valid @RequestBody CreateTripDTO createTripDTO) {
        TripDTO createdTrip = bookingService.createTripForBooking(bookingId, createTripDTO);
        if (createdTrip == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(createdTrip);
    }

    @GetMapping("/{bookingId}/trip")
    public ResponseEntity<Trip> getTripByBookingId(@PathVariable String bookingId) {
        return bookingService.getTripByBookingId(bookingId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/sale-staff")
    public ResponseEntity<List<BookingDTO>> getBookingsByStatusRequestedPendingApproved() {
        List<BookingDTO> bookings = bookingService.getBookingsByStatusForSaleStaff();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/consulting-staff")
    public ResponseEntity<List<BookingDTO>> getBookingsByStatusConfirmedOngoing() {
        List<BookingDTO> bookings = bookingService.getBookingsByStatusForConsultingStaff();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/sale-staff/{customerId}")
    public ResponseEntity<?> getBookingsByStatusAndCustomerId(
            @PathVariable String customerId) {
        try {
            List<BookingDTO> bookings = bookingService.getBookingsByStatusAndCustomerIdForSaleStaff(customerId);
            return ResponseEntity.ok(bookings);
        } catch (RuntimeException e) {
            ErrorDTO errorDTO = new ErrorDTO(404, "Customer not found");
            return ResponseEntity.status(404).body(errorDTO);
        }
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<?> getBookingByTripId(@PathVariable String tripId) {
        Optional<BookingDTO> booking = bookingService.getBookingByTripId(tripId);
        if (booking.isPresent()) {
            return ResponseEntity.ok(booking.get());
        } else {
            ErrorDTO errorDTO = new ErrorDTO(404, "Booking not found");
            return ResponseEntity.status(404).body(errorDTO);
        }
    }

    @PutMapping("/{booking_id}/add-fish-order-to-booking/{order_id}")
    public ResponseEntity<BookingDTO> addFishOrderToBooking(@PathVariable String booking_id,
                                                            @PathVariable String order_id) {
        Booking updateBooking = bookingService.updateOrderToBooking(booking_id, order_id);
        return ResponseEntity.ok(bookingService.mapToDTO(updateBooking));
    }

    @PutMapping("/{booking_id}/remove-fish-order-from-booking/{order_id}")
    public ResponseEntity<BookingDTO> removeFishOrderFromBooking(@PathVariable String booking_id,
                                                                 @PathVariable String order_id) {
        Booking removedBooking = bookingService.removeOrderFromBooking(booking_id, order_id);
        return ResponseEntity.ok(bookingService.mapToDTO(removedBooking));
    }



//    @RequestMapping("/get-fish-orders/{booking_id}")
//    public  ResponseEntity<List<FishOrderDTO>> getFishOrdersByBookingID(@PathVariable String booking_id){
//        List<FishOrderDTO> newList = bookingService.getAllFishOrderByBookingId(booking_id);
//        if(newList.isEmpty()){
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(newList);
//    }
}
