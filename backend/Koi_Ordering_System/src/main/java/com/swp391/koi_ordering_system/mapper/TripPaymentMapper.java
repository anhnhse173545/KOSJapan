package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.response.TripPaymentDTO;
import com.swp391.koi_ordering_system.model.TripPayment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TripPaymentMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "amount", target = "amount")
    TripPaymentDTO toDTO(TripPayment tripPayment);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "amount", target = "amount")
    TripPayment toEntity(TripPaymentDTO tripPaymentDTO);
}