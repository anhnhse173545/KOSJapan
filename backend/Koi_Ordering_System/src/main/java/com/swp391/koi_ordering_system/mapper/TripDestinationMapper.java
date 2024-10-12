package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.request.AddTripDestinationDTO;
import com.swp391.koi_ordering_system.dto.response.TripDestinationDTO;
import com.swp391.koi_ordering_system.model.TripDestination;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TripDestinationMapper {

    TripDestinationDTO toTripDestinationDTO(TripDestination tripDestination);

    TripDestination toTripDestination(TripDestinationDTO tripDestinationDTO);

    AddTripDestinationDTO toDTO(TripDestination tripDestination);

    TripDestination toEntity(AddTripDestinationDTO addTripDestinationDTO);
}