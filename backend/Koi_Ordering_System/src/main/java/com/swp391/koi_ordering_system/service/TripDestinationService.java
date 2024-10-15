package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.AddTripDestinationDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateTripDestinationDTO;
import com.swp391.koi_ordering_system.dto.response.TripDestinationDTO;
import com.swp391.koi_ordering_system.mapper.TripDestinationMapper;
import com.swp391.koi_ordering_system.model.Farm;
import com.swp391.koi_ordering_system.model.Trip;
import com.swp391.koi_ordering_system.model.TripDestination;
import com.swp391.koi_ordering_system.repository.FarmRepository;
import com.swp391.koi_ordering_system.repository.TripDestinationRepository;
import com.swp391.koi_ordering_system.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TripDestinationService {
    @Autowired
    private TripDestinationRepository tripDestinationRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private FarmService farmService;

    @Autowired
    private TripDestinationMapper tripDestinationMapper;


    public TripDestination createTripDestination(String tripId, AddTripDestinationDTO addTripDestinationDTO) {
        Trip trip = tripRepository.findByIdAndIsDeletedFalse(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        Farm farm = farmRepository.findById(addTripDestinationDTO.getFarmId())
                .orElseThrow(() -> new RuntimeException("Farm not found"));
        TripDestination tripDestination = tripDestinationMapper.toEntity(addTripDestinationDTO);
        tripDestination.setId(generateTripDestinationId());
        tripDestination.setTrip(trip);
        tripDestination.setFarm(farm);
        return tripDestinationRepository.save(tripDestination);
    }

    private String generateTripDestinationId() {
        String lastTripDestinationId = tripDestinationRepository.findTopByOrderByIdDesc()
                .map(TripDestination::getId)
                .orElse("TD0000");
        int nextId = Integer.parseInt(lastTripDestinationId.substring(2)) + 1;
        return String.format("TD%04d", nextId);
    }

    public TripDestination updateTripDestination(String tripDestinationId, UpdateTripDestinationDTO updateTripDestinationDTO) {
        TripDestination tripDestination = tripDestinationRepository.findById(tripDestinationId)
                .orElseThrow(() -> new RuntimeException("TripDestination not found"));
        if (updateTripDestinationDTO.getFarmId() != null) {
            Farm farm = farmRepository.findById(updateTripDestinationDTO.getFarmId())
                    .orElseThrow(() -> new RuntimeException("Farm not found"));
            tripDestination.setFarm(farm);
        }
        if (updateTripDestinationDTO.getVisitDate() != null) {
            tripDestination.setVisitDate(updateTripDestinationDTO.getVisitDate());
        }
        if (updateTripDestinationDTO.getDescription() != null) {
            tripDestination.setDescription(updateTripDestinationDTO.getDescription());
        }
        return tripDestinationRepository.save(tripDestination);
    }

    public List<TripDestinationDTO> getAllTripDestinationsByTripId(String tripId) {
        List<TripDestination> tripDestinations = tripDestinationRepository.findByTripIdAndIsDeletedFalse(tripId);
        return tripDestinations.stream()
                .map(tripDestinationMapper::toTripDestinationDTO)
                .collect(Collectors.toList());
    }

    public Optional<TripDestinationDTO> getTripDestinationById(String id) {
        return tripDestinationRepository.findByIdAndIsDeletedFalse(id)
                .map(tripDestinationMapper::toTripDestinationDTO);
    }

    public void deleteTripDestination(String tripDestinationId) {
        TripDestination tripDestination = tripDestinationRepository.findById(tripDestinationId)
                .orElseThrow(() -> new RuntimeException("TripDestination not found"));
        tripDestination.setIsDeleted(true);
        tripDestinationRepository.save(tripDestination);
    }

    public TripDestinationDTO mapToDTO(TripDestination tripDestination) {
        TripDestinationDTO tripDestinationDTO = new TripDestinationDTO();
        if(tripDestinationDTO == null){
            return null;
        }
        tripDestinationDTO.setId(tripDestination.getId());
        tripDestinationDTO.setDescription(tripDestination.getDescription());
        tripDestinationDTO.setVisitDate(tripDestination.getVisitDate());
        tripDestinationDTO.setFarm(farmService.mapToDTO(tripDestination.getFarm()));
        return tripDestinationDTO;
    }

}
