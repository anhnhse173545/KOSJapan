package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.UpdateTripDTO;
import com.swp391.koi_ordering_system.dto.response.TripDTO;
import com.swp391.koi_ordering_system.dto.response.TripDestinationDTO;
import com.swp391.koi_ordering_system.dto.response.TripWithCustomerAndSaleStaffDTO;
import com.swp391.koi_ordering_system.mapper.TripMapper;
import com.swp391.koi_ordering_system.model.Farm;
import com.swp391.koi_ordering_system.model.Trip;
import com.swp391.koi_ordering_system.model.TripDestination;
import com.swp391.koi_ordering_system.repository.FarmRepository;
import com.swp391.koi_ordering_system.repository.TripDestinationRepository;
import com.swp391.koi_ordering_system.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TripService {
    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private TripDestinationRepository tripDestinationRepository;

    @Autowired
    private TripDestinationService tripDestinationService;

    @Autowired
    private TripMapper tripMapper;

    public Trip createTrip(Trip trip) {
        trip.setId(generateTripId());
        return tripRepository.save(trip);
    }

    public List<TripDTO> getAllTrips() {
        return tripRepository.findAllByIsDeletedFalse().stream()
                .map(tripMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<TripDTO> getTripById(String id) {
        return tripRepository.findByIdAndIsDeletedFalse(id)
                .map(tripMapper::toDTO);
    }

    public Optional<TripWithCustomerAndSaleStaffDTO> getTripByIdCustomerAndSale(String id) {
        return tripRepository.findByIdAndIsDeletedFalse(id)
                .map(tripMapper::toTripWithCustomerAndSaleStaffDTO);
    }

    public TripDTO updateTrip(String tripId, UpdateTripDTO updateTripDTO) {
        Trip trip = tripRepository.findByIdAndIsDeletedFalse(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (updateTripDTO.getStartDate() != null) {
            trip.setStartDate(updateTripDTO.getStartDate());
        }

        if (updateTripDTO.getEndDate() != null) {
            trip.setEndDate(updateTripDTO.getEndDate());
        }

        if (updateTripDTO.getDepartureAirport() != null) {
            trip.setDepartureAirport(updateTripDTO.getDepartureAirport());
        }
        if (updateTripDTO.getDescription() != null) {
            trip.setDescription(updateTripDTO.getDescription());
        }

        if (updateTripDTO.getPrice() != null) {
            trip.setPrice(updateTripDTO.getPrice());
        }

        if (updateTripDTO.getStatus() != null) {
            trip.setStatus(updateTripDTO.getStatus());
        }

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

//    public Trip addFarmToTrip(String tripId, String farmId) {
//        Optional<Trip> tripOptional = tripRepository.findById(tripId);
//        Optional<Farm> farmOptional = farmRepository.findById(farmId);
//
//        if (tripOptional.isPresent() && farmOptional.isPresent()) {
//            Trip trip = tripOptional.get();
//            Farm farm = farmOptional.get();
//            TripDestination tripDestination = new TripDestination();
//            tripDestination.setTrip(trip);
//            tripDestination.setFarm(farm);
//            tripDestinationRepository.save(tripDestination);
//            return trip;
//        }
//        return null;
//    }

    public List<Farm> getFarmsByTripId(String tripId) {
        return tripDestinationRepository.findByTripIdAndIsDeletedFalse(tripId).stream()
                .map(TripDestination::getFarm)
                .collect(Collectors.toList());
    }

//    public void removeFarmFromTrip(String tripId, String farmId) {
//        Trip trip = tripRepository.findById(tripId).orElseThrow(() -> new RuntimeException("Trip not found"));
//        Farm farm = farmRepository.findById(farmId).orElseThrow(() -> new RuntimeException("Farm not found"));
//
//        TripDestination tripDestination = tripDestinationRepository.findByTripAndFarm(trip, farm)
//                .orElseThrow(() -> new RuntimeException("TripDestination not found"));
//        tripDestinationRepository.delete(tripDestination);
//    }

    public TripDTO mapToDTO(Trip trip) {
        TripDTO tripDTO = new TripDTO();
        tripDTO.setId(trip.getId());
        tripDTO.setStartDate(trip.getStartDate());
        tripDTO.setEndDate(trip.getEndDate());
        tripDTO.setDepartureAirport(trip.getDepartureAirport());
        tripDTO.setDescription(trip.getDescription());
        tripDTO.setPrice(trip.getPrice());
        tripDTO.setStatus(trip.getStatus());

        Set<TripDestination> tripDestinations = trip.getTripDestinations();
        Set<TripDestinationDTO> tripDestinationDTOSet = new HashSet<>();
        for (TripDestination tripDestination : tripDestinations ){
            TripDestinationDTO DTO = new TripDestinationDTO();
            DTO = tripDestinationService.mapToDTO(tripDestination);
            tripDestinationDTOSet.add(DTO);
        }

        tripDTO.setTripDestinations(tripDestinationDTOSet);
        return tripDTO;
    }

    public void removeTripById(String tripId ) {
        Trip trip = tripRepository.findById(tripId).orElseThrow(() -> new RuntimeException("Trip not found"));

        TripDestination tripDestination = tripDestinationRepository.findByTrip(trip)
                .orElseThrow(() -> new RuntimeException("TripDestination not found"));
        tripDestinationRepository.delete(tripDestination);
    }

    public String generateTripId() {
        String lastTripId = tripRepository.findTopByOrderByIdDesc()
                .map(Trip::getId)
                .orElse("TR0000");
        int nextId = Integer.parseInt(lastTripId.substring(2)) + 1;
        return String.format("TR%04d", nextId);
    }
}