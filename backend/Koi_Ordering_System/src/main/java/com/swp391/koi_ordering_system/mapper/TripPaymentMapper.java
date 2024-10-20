package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.request.CreateTripPaymentDTO;
import com.swp391.koi_ordering_system.dto.response.TripPaymentDTO;
import com.swp391.koi_ordering_system.model.TripPayment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TripPaymentMapper {

    TripPaymentDTO toDTO(TripPayment tripPayment);

    TripPayment toEntity(TripPaymentDTO tripPaymentDTO);

    TripPayment toEntity(CreateTripPaymentDTO tripPaymentDTO);
}