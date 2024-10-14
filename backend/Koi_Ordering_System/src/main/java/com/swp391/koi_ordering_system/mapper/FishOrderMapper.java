package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.request.CreateFishOrderDTO;
import com.swp391.koi_ordering_system.dto.response.DeliveryStaffOrderDTO;
import com.swp391.koi_ordering_system.dto.response.FishOrderDTO;
import com.swp391.koi_ordering_system.model.FishOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {AccountMapper.class})
public interface FishOrderMapper {
    //@Mapping(source = "fishPackOrderDetails", target = "fishPackOrderDetails")
    @Mapping(source = "booking.id", target = "bookingId")
    @Mapping(source = "farm.id", target = "farmId")
    FishOrderDTO toDTO(FishOrder fishOrder);

    FishOrder toEntity(FishOrderDTO fishOrderDTO);

    @Mapping(source = "bookingId", target = "booking.id")
    @Mapping(source = "farmId", target = "farm.id")
    FishOrder toEntity(CreateFishOrderDTO createFishOrderDTO);

    @Mapping(source = "booking.deliveryStaff", target = "deliveryStaff")
    @Mapping(source = "booking.id", target = "bookingId")
    @Mapping(source = "farm.id", target = "farmId")
    DeliveryStaffOrderDTO toDeliveryStaffOrderDTO(FishOrder fishOrder);

    @Mapping(source = "deliveryStaff", target = "booking.deliveryStaff")
    @Mapping(source = "bookingId", target = "booking.id")
    @Mapping(source = "farmId", target = "farm.id")
    FishOrder toEntity(DeliveryStaffOrderDTO deliveryStaffOrderDTO);
}