package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.request.CreateTripPaymentDTO;
import com.swp391.koi_ordering_system.dto.response.TripPaymentDTO;
import com.swp391.koi_ordering_system.model.TripPayment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TripPaymentMapper {

    @Mapping(source = "paymentMethod.name", target = "paymentMethodName")
    TripPaymentDTO toDTO(TripPayment tripPayment);

    @Mapping(source = "paymentMethodName", target = "paymentMethod.name")
    TripPayment toEntity(TripPaymentDTO tripPaymentDTO);

    TripPayment toEntity(CreateTripPaymentDTO tripPaymentDTO);
}