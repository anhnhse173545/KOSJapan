package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.request.CreateTripDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateTripDTO;
import com.swp391.koi_ordering_system.dto.response.TripDTO;
import com.swp391.koi_ordering_system.model.Trip;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {TripDestinationMapper.class})
public interface TripMapper {

    TripDTO toDTO(Trip trip);

    Trip toEntity(TripDTO tripDTO);

    Trip toEntity(CreateTripDTO createTripDTO);

    void updateEntityFromDTO(UpdateTripDTO updateTripDTO, @MappingTarget Trip trip);
}