package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.response.TripDestinationDTO;
import com.swp391.koi_ordering_system.model.TripDestination;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TripDestinationMapper {
    TripDestinationDTO toTripDestinationDTO(TripDestination tripDestination);
    TripDestination toTripDestination(TripDestinationDTO tripDestinationDTO);
}