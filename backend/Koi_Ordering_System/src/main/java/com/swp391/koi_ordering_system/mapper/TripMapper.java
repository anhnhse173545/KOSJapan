package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.request.CreateTripDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateTripDTO;
import com.swp391.koi_ordering_system.dto.response.TripDTO;
import com.swp391.koi_ordering_system.model.Trip;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TripMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "startDate", target = "startDate")
    @Mapping(source = "endDate", target = "endDate")
    @Mapping(source = "departureAirport", target = "departureAirport")
    @Mapping(source = "price", target = "price")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "farms", target = "farms")
    TripDTO toDTO(Trip trip);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "startDate", target = "startDate")
    @Mapping(source = "endDate", target = "endDate")
    @Mapping(source = "departureAirport", target = "departureAirport")
    @Mapping(source = "price", target = "price")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "farms", target = "farms")
    Trip toEntity(TripDTO tripDTO);

    @Mapping(source = "startDate", target = "startDate")
    @Mapping(source = "endDate", target = "endDate")
    @Mapping(source = "departureAirport", target = "departureAirport")
    @Mapping(source = "price", target = "price")
    Trip toEntity(CreateTripDTO createTripDTO);

    @Mapping(source = "startDate", target = "startDate")
    @Mapping(source = "endDate", target = "endDate")
    @Mapping(source = "departureAirport", target = "departureAirport")
    @Mapping(source = "price", target = "price")
    @Mapping(source = "status", target = "status")
    void updateEntityFromDTO(UpdateTripDTO updateTripDTO, @MappingTarget Trip trip);
}