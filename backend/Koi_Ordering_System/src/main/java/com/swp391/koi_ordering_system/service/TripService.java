package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.UpdateTripDTO;
import com.swp391.koi_ordering_system.dto.response.BookingDTO;
import com.swp391.koi_ordering_system.dto.response.TripDTO;
import com.swp391.koi_ordering_system.dto.response.TripDestinationDTO;
import com.swp391.koi_ordering_system.dto.response.TripWithCustomerAndSaleStaffDTO;
import com.swp391.koi_ordering_system.mapper.TripMapper;
import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.Farm;
import com.swp391.koi_ordering_system.model.Trip;
import com.swp391.koi_ordering_system.model.TripDestination;
import com.swp391.koi_ordering_system.repository.BookingRepository;
import com.swp391.koi_ordering_system.repository.FarmRepository;
import com.swp391.koi_ordering_system.repository.TripDestinationRepository;
import com.swp391.koi_ordering_system.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.*;
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
    private BookingRepository bookingRepository;

    @Autowired
    private TripDestinationService tripDestinationService;

    @Autowired
    private AuthService authService;

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

    public List<TripDTO> getTripsByStatus(String status) {
        return tripRepository.findByStatusAndIsDeletedFalse(status).stream()
                .map(tripMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<TripWithCustomerAndSaleStaffDTO> getTripByIdCustomerAndSale(String id) {
        return tripRepository.findByIdAndIsDeletedFalse(id)
                .map(tripMapper::toTripWithCustomerAndSaleStaffDTO);
    }

    public TripDTO updateTrip(String tripId, UpdateTripDTO updateTripDTO) {
        Trip trip = tripRepository.findByIdAndIsDeletedFalse(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        Set<String> salesStatuses = Set.of("Pending");
        Set<String> consultingStatuses = Set.of("On-going", "Completed");

        boolean isCustomer = authService.isRole("ROLE_Customer");

        boolean isManager = authService.isRole("ROLE_Manager");
//        boolean isManager = true;

        boolean isSalesStaff = authService.isRole("ROLE_Sales_Staff");

        boolean isConsultingStaff = authService.isRole("ROLE_Consulting_Staff");

        boolean isDeliveryStaff = authService.isRole("ROLE_Delivery_Staff");

        if (updateTripDTO.getStartDate() != null) {
            if (!isManager && !isSalesStaff ) {
                throw new AccessDeniedException("Unauthorized to update start date");
            }
            trip.setStartDate(updateTripDTO.getStartDate());
        }

        if (updateTripDTO.getEndDate() != null) {
            if (!isManager && !isSalesStaff ) {
                throw new AccessDeniedException("Unauthorized to update end date");
            }
            trip.setEndDate(updateTripDTO.getEndDate());
        }

        if (updateTripDTO.getDepartureAirport() != null) {
            if (!isManager && !isSalesStaff ) {
                throw new AccessDeniedException("Unauthorized to update departure airport");
            }
            trip.setDepartureAirport(updateTripDTO.getDepartureAirport());
        }
        if (updateTripDTO.getDescription() != null) {
            if (!isManager && !isSalesStaff ) {
                throw new AccessDeniedException("Unauthorized to update description");
            }
            trip.setDescription(updateTripDTO.getDescription());
        }

        if (updateTripDTO.getPrice() != null) {
            if (!isManager && !isSalesStaff ) {
                throw new AccessDeniedException("Unauthorized to update price");
            }
            trip.setPrice(updateTripDTO.getPrice());
        }

        if (updateTripDTO.getStatus() != null) {
            if (isManager) {
                trip.setStatus(updateTripDTO.getStatus());
            }
            else if (isSalesStaff && salesStatuses.contains(updateTripDTO.getStatus())) {
                trip.setStatus(updateTripDTO.getStatus());
            }
            else if (isConsultingStaff && consultingStatuses.contains(updateTripDTO.getStatus())) {
                trip.setStatus(updateTripDTO.getStatus());
            }
            else {
                throw new AccessDeniedException("Unauthorized to update status");
            }
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

    public List<Trip> findTripsByCustomerId(String customerId) {
        List<Booking> list = bookingRepository.findByCustomerIdAndIsDeletedFalse(customerId);
        if (list.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }
        List<Trip> listTrip = new ArrayList<>();
        for (Booking booking : list) {
            Trip trip = booking.getTrip();
            listTrip.add(trip);
        }
        return listTrip;
    }

    public TripDTO mapToDTO(Trip trip) {
        TripDTO tripDTO = new TripDTO();
        if(trip == null){
            return null;
        }
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