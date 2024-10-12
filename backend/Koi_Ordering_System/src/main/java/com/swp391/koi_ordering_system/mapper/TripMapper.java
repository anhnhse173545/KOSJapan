package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.request.CreateTripDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateTripDTO;
import com.swp391.koi_ordering_system.dto.response.TripDTO;
import com.swp391.koi_ordering_system.dto.response.TripWithCustomerAndSaleStaffDTO;
import com.swp391.koi_ordering_system.model.Trip;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {TripDestinationMapper.class, AccountMapper.class, FishOrderMapper.class})
public interface TripMapper {
    @Mapping(target = "description", source = "description")
    TripDTO toDTO(Trip trip);

    Trip toEntity(TripDTO tripDTO);


    Trip toEntity(CreateTripDTO createTripDTO);

    void updateEntityFromDTO(UpdateTripDTO updateTripDTO, @MappingTarget Trip trip);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "booking.customer", target = "customer")
    @Mapping(source = "booking.saleStaff", target = "saleStaff")
    @Mapping(source = "description", target = "description")
    @Mapping(source = "startDate", target = "startDate")
    @Mapping(source = "endDate", target = "endDate")
    @Mapping(source = "departureAirport", target = "departureAirport")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "booking.description", target = "bookingDescription")
    @Mapping(source = "booking.fishOrders", target = "fishOrders")
    TripWithCustomerAndSaleStaffDTO toTripWithCustomerAndSaleStaffDTO(Trip trip);

    
}
