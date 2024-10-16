package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.CreateTripDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateTripDTO;
import com.swp391.koi_ordering_system.dto.response.BookingDTO;
import com.swp391.koi_ordering_system.dto.response.ErrorDTO;
import com.swp391.koi_ordering_system.dto.response.TripDTO;
import com.swp391.koi_ordering_system.dto.response.TripWithCustomerAndSaleStaffDTO;
import com.swp391.koi_ordering_system.mapper.TripMapper;
import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.Farm;
import com.swp391.koi_ordering_system.model.Trip;
import com.swp391.koi_ordering_system.service.TripService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/trip")
public class TripController {

    @Autowired
    private TripService tripService;

    @Autowired
    private TripMapper tripMapper;

    @PostMapping("/create")
    public ResponseEntity<TripDTO> createTrip(@Valid @RequestBody CreateTripDTO createTripDTO) {
        Trip trip = tripMapper.toEntity(createTripDTO);
        return ResponseEntity.ok(tripMapper.toDTO(tripService.createTrip(trip)));
    }

    @GetMapping("/list")
    public ResponseEntity<List<TripDTO>> getAllTrip() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Optional<TripDTO>> getTripById(@PathVariable String id) {
        Optional<TripDTO> trip = tripService.getTripById(id);
        if (trip.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(trip);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getTripsByStatus(@PathVariable String status) {
        List<TripDTO> trips = tripService.getTripsByStatus(status);
        if (trips.isEmpty()) {
            ErrorDTO errorDTO = new ErrorDTO(404, "Trip not found");
            return ResponseEntity.status(404).body(errorDTO);
        }
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/get/{id}/customer-sale")
    public ResponseEntity<Optional<TripWithCustomerAndSaleStaffDTO>> getTripByIdCustomerAndSale(@PathVariable String id) {
        Optional<TripWithCustomerAndSaleStaffDTO> trip = tripService.getTripByIdCustomerAndSale(id);
        if (trip.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(trip);
    }

    @GetMapping("{customer_id}/get-all-trips-of-customer")
    public ResponseEntity<List<TripDTO>> getAllTripsOfCustomer(@PathVariable String customer_id) {
        List<Trip> list = tripService.findTripsByCustomerId(customer_id);
        List<TripDTO> showList = new ArrayList<>();
        for (Trip trip : list) {
            TripDTO tripDTO = tripService.mapToDTO(trip);
            showList.add(tripDTO);
        }
        return ResponseEntity.ok(showList);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<TripDTO> updateTrip(@PathVariable String id, @Valid @RequestBody UpdateTripDTO updateTripDTO) {
        TripDTO updatedTrip = tripService.updateTrip(id, updateTripDTO);
        if (updatedTrip == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedTrip);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTrip(@PathVariable String id) {
        tripService.deleteTrip(id);
        return ResponseEntity.ok("Trip deleted successfully");
    }

//    @PostMapping("/{tripId}/add-farm/{farmId}")
//    public ResponseEntity<Trip> addFarmToTrip(@PathVariable String tripId, @PathVariable String farmId) {
//        Trip updatedTrip = tripService.addFarmToTrip(tripId, farmId);
//        if (updatedTrip == null) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(updatedTrip);
//    }

//    @DeleteMapping("/{tripId}/farm/{farmId}")
//    public ResponseEntity<Void> removeFarmFromTrip(@PathVariable String tripId, @PathVariable String farmId) {
//        tripService.removeFarmFromTrip(tripId, farmId);
//        return ResponseEntity.noContent().build();
//    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<Void> removeTripById(@PathVariable String tripId) {
        tripService.removeTripById(tripId);
        return ResponseEntity.noContent().build();
    }

//    @GetMapping("/{tripId}/farm")
//    public ResponseEntity<List<Farm>> getFarmsByTripId(@PathVariable String tripId) {
//        List<Farm> farms = tripService.getFarmsByTripId(tripId);
//        if (farms == null || farms.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(farms);
//    }
}
