package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.UpdateTripDTO;
import com.swp391.koi_ordering_system.dto.response.TripDTO;
import com.swp391.koi_ordering_system.mapper.TripMapper;
import com.swp391.koi_ordering_system.model.Farm;
import com.swp391.koi_ordering_system.model.Trip;
import com.swp391.koi_ordering_system.repository.FarmRepository;
import com.swp391.koi_ordering_system.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TripService {
    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private TripMapper tripMapper;

    public Trip createTrip(Trip trip) {
        trip.setId(generateTripId());
        return tripRepository.save(trip);
    }

//    public List<Trip> getAllTrip() {
//        return tripRepository.findAllByIsDeletedFalse();
//    }

    public List<TripDTO> getAllTrips() {
        return tripRepository.findAllByIsDeletedFalse().stream()
                .map(tripMapper::toDTO)
                .collect(Collectors.toList());
    }

//    public Optional<Trip> getTripById(String id) {
//        return tripRepository.findByIdAndIsDeletedFalse(id);
//    }

    public Optional<TripDTO> getTripById(String id) {
        return tripRepository.findByIdAndIsDeletedFalse(id)
                .map(tripMapper::toDTO);
    }

//    public Trip updateTrip(String id, Trip tripDetails) {
//        Optional<Trip> optionalTrip = tripRepository.findById(id);
//        if (optionalTrip.isPresent()) {
//            Trip trip = optionalTrip.get();
//
//            if (tripDetails.getStatus() != null) {
//                trip.setStatus(tripDetails.getStatus());
//            }
//            return tripRepository.save(trip);
//        }
//        return null;
//    }

    public TripDTO updateTrip(String tripId, UpdateTripDTO updateTripDTO) {
        Trip trip = tripRepository.findByIdAndIsDeletedFalse(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        tripMapper.updateEntityFromDTO(updateTripDTO, trip);
        Trip updatedTrip = tripRepository.save(trip);
        return tripMapper.toDTO(updatedTrip);
    }

    public void deleteTrip(String id) {
        Trip trip = tripRepository.findByIdAndIsDeletedFalse(id).orElse(null);
        if (trip != null) {
            trip.setIsDeleted(true);
            tripRepository.save(trip);
        }
    }

    public Trip addFarmToTrip(String tripId, String farmId) {
        Optional<Trip> tripOptional = tripRepository.findById(tripId);
        Optional<Farm> farmOptional = farmRepository.findById(farmId);

        if (tripOptional.isPresent() && farmOptional.isPresent()) {
            Trip trip = tripOptional.get();
            Farm farm = farmOptional.get();
            trip.getFarms().add(farm);
            return tripRepository.save(trip);
        }
        return null;
    }

    public List<Farm> getFarmsByTripId(String tripId) {
        Optional<Trip> tripOptional = tripRepository.findByIdAndIsDeletedFalse(tripId);
        if (tripOptional.isPresent()) {
            return farmRepository.findByTripsIdAndIsDeletedFalse(tripId);
        }
        return null;
    }

    public void removeFarmFromTrip(String tripId, String farmId) {
        Trip trip = tripRepository.findById(tripId).orElseThrow(() -> new RuntimeException("Trip not found"));
        Farm farm = farmRepository.findById(farmId).orElseThrow(() -> new RuntimeException("Farm not found"));

        trip.getFarms().remove(farm);
        tripRepository.save(trip);
    }

    public String generateTripId() {
        String lastTripId = tripRepository.findTopByOrderByIdDesc()
                .map(Trip::getId)
                .orElse("TR0000");
        int nextId = Integer.parseInt(lastTripId.substring(2)) + 1;
        return String.format("TR%04d", nextId);
    }
}
