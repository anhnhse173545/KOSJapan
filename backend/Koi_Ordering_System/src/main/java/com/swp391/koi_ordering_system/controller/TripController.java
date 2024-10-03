package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.CreateTripDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateTripDTO;
import com.swp391.koi_ordering_system.dto.response.BookingDTO;
import com.swp391.koi_ordering_system.dto.response.TripDTO;
import com.swp391.koi_ordering_system.mapper.TripMapper;
import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.Farm;
import com.swp391.koi_ordering_system.model.Trip;
import com.swp391.koi_ordering_system.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/trip")
public class TripController {

    @Autowired
    private TripService tripService;

    @Autowired
    private TripMapper tripMapper;

    //    @RequestMapping("/create")
//    public Trip createTrip(@RequestBody Trip trip) {
//        return tripService.createTrip(trip);
//    }
    @RequestMapping("/create")
    public ResponseEntity<TripDTO> createTrip(@RequestBody CreateTripDTO createTripDTO) {
        Trip trip = tripMapper.toEntity(createTripDTO);
        tripService.createTrip(trip);
        return ResponseEntity.ok(tripMapper.toDTO(trip));
    }

    @RequestMapping("/list")
    public ResponseEntity<List<TripDTO>> getAllTrip() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }



//    @RequestMapping("/get/{id}")
//    public ResponseEntity<Optional<Trip>> getTripById(@PathVariable String id) {
//        Optional<Trip> trip = tripService.getTripById(id);
//        if (trip.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(trip);
//    }

    @RequestMapping("/get/{id}")
    public ResponseEntity<Optional<TripDTO>> getBookingById(@PathVariable String id) {
        Optional<TripDTO> trip = tripService.getTripById(id);
        if (trip.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(trip);
    }

    @RequestMapping("/update/{id}")
    public ResponseEntity<TripDTO> updateTrip(@PathVariable String id, @RequestBody UpdateTripDTO updateTripDTO) {
        TripDTO updatedTrip = tripService.updateTrip(id, updateTripDTO);
        if (updatedTrip == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedTrip);
    }

    @RequestMapping("/delete/{id}")
    public ResponseEntity<String> deleteTrip(@PathVariable String id) {
        tripService.deleteTrip(id);
        return ResponseEntity.ok("Trip deleted successfully");
    }

    @RequestMapping("/{tripId}/add-farm/{farmId}")
    public ResponseEntity<Trip> addFarmToTrip(@PathVariable String tripId, @PathVariable String farmId) {
        Trip updatedTrip = tripService.addFarmToTrip(tripId, farmId);
        if (updatedTrip == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedTrip);
    }

    @RequestMapping("/{tripId}/farm/{farmId}")
    public ResponseEntity<Void> removeFarmFromTrip(@PathVariable String tripId, @PathVariable String farmId) {
        tripService.removeFarmFromTrip(tripId, farmId);
        return ResponseEntity.noContent().build();
    }

    @RequestMapping("/{tripId}/farm")
    public ResponseEntity<List<Farm>> getFarmsByTripId(@PathVariable String tripId) {
        List<Farm> farms = tripService.getFarmsByTripId(tripId);
        if (farms == null || farms.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(farms);
    }
}
