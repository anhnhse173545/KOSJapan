package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.request.CreateFishOrderDTO;
import com.swp391.koi_ordering_system.dto.response.DeliveryStaffOrderDTO;
import com.swp391.koi_ordering_system.dto.response.FishOrderDTO;
import com.swp391.koi_ordering_system.model.FishOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {AccountMapper.class, FishOrderDetailMapper.class})
public interface FishOrderMapper {
    //@Mapping(source = "fishPackOrderDetails", target = "fishPackOrderDetails")
    @Mapping(source = "booking.consultingStaff", target = "consultingStaff")
    @Mapping(source = "booking.deliveryStaff", target = "deliveryStaff")
    @Mapping(source = "booking.customer", target = "customer")
    @Mapping(source = "booking.id", target = "bookingId")
    @Mapping(source = "farm.id", target = "farmId")
    @Mapping(source = "paymentStatus", target = "paymentStatus")
    FishOrderDTO toDTO(FishOrder fishOrder);

    @Mapping(source = "farmId", target = "farm.id")
    @Mapping(source = "bookingId", target = "booking.id")
    @Mapping(source = "consultingStaff", target = "booking.consultingStaff")
    @Mapping(source = "deliveryStaff", target = "booking.deliveryStaff")
    @Mapping(source = "customer", target = "booking.customer")
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