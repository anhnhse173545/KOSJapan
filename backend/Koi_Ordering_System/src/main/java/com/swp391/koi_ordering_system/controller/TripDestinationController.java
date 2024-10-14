package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.AddTripDestinationDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateTripDestinationDTO;
import com.swp391.koi_ordering_system.dto.response.BookingDTO;
import com.swp391.koi_ordering_system.dto.response.ErrorDTO;
import com.swp391.koi_ordering_system.dto.response.TripDestinationDTO;
import com.swp391.koi_ordering_system.mapper.TripDestinationMapper;
import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.TripDestination;
import com.swp391.koi_ordering_system.service.TripDestinationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trip-destination")
public class TripDestinationController  {

    @Autowired
    private TripDestinationService tripDestinationService;

    @Autowired
    private TripDestinationMapper tripDestinationMapper;

    @PostMapping("{tripId}/create")
    public ResponseEntity<TripDestinationDTO> createTripDestination(@PathVariable String tripId, @RequestBody AddTripDestinationDTO addTripDestinationDTO) {
        TripDestination tripDestination = tripDestinationService.createTripDestination(tripId, addTripDestinationDTO);
        TripDestinationDTO tripDestinationDTO = tripDestinationMapper.toTripDestinationDTO(tripDestination);
        return ResponseEntity.ok(tripDestinationDTO);
    }

    @PutMapping("{tripDestinationId}/update")
    public ResponseEntity<TripDestinationDTO> updateTripDestination(@PathVariable String tripDestinationId, @RequestBody UpdateTripDestinationDTO updateTripDestinationDTO) {
        TripDestination updatedTripDestination = tripDestinationService.updateTripDestination(tripDestinationId, updateTripDestinationDTO);
        TripDestinationDTO tripDestinationDTO = tripDestinationMapper.toTripDestinationDTO(updatedTripDestination);
        return ResponseEntity.ok(tripDestinationDTO);
    }

    @DeleteMapping("{tripDestinationId}/delete")
    public ResponseEntity<Void> deleteTripDestination(@PathVariable String tripDestinationId) {
        tripDestinationService.deleteTripDestination(tripDestinationId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("{tripId}/list")
    public ResponseEntity<List<TripDestinationDTO>> getAllTripDestinationsByTripId(@PathVariable String tripId) {
        List<TripDestinationDTO> tripDestinations = tripDestinationService.getAllTripDestinationsByTripId(tripId);
        return ResponseEntity.ok(tripDestinations);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getTripDestinationId(@PathVariable String id) {
        Optional<TripDestinationDTO> tripDestination = tripDestinationService.getTripDestinationById(id);
        if (tripDestination.isEmpty()) {
            ErrorDTO errorDTO = new ErrorDTO(404, "Booking not found");
            return ResponseEntity.status(404).body(errorDTO);
        }
        return ResponseEntity.ok(tripDestination);
    }

}
