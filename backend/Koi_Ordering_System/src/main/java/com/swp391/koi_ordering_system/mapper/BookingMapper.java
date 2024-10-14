package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.request.CreateBookingDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateBookingDTO;
import com.swp391.koi_ordering_system.dto.response.BookingDTO;
import com.swp391.koi_ordering_system.model.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {AccountMapper.class, TripMapper.class, TripPaymentMapper.class, FishOrderMapper.class})
public interface BookingMapper {
    @Mapping(source = "customer", target = "customer")
    @Mapping(source = "trip", target = "trip")
    @Mapping(source = "tripPayment", target = "tripPayment")
    @Mapping(source = "saleStaff", target = "saleStaff")
    @Mapping(source = "consultingStaff", target = "consultingStaff")
    @Mapping(source = "deliveryStaff", target = "deliveryStaff")
    @Mapping(source = "fishOrders", target = "fishOrders")
    BookingDTO toDTO(Booking booking);

    @Mapping(source = "customer", target = "customer")
    @Mapping(source = "trip", target = "trip")
    @Mapping(source = "tripPayment", target = "tripPayment")
    @Mapping(source = "saleStaff", target = "saleStaff")
    @Mapping(source = "consultingStaff", target = "consultingStaff")
    @Mapping(source = "deliveryStaff", target = "deliveryStaff")
    Booking toEntity(BookingDTO bookingDTO);

    @Mapping(source = "description", target = "description")
    Booking toEntity(CreateBookingDTO createBookingDTO);

    @Mapping(source = "tripId", target = "trip.id")
    @Mapping(source = "saleStaffId", target = "saleStaff.id")
    @Mapping(source = "consultingStaffId", target = "consultingStaff.id")
    @Mapping(source = "deliveryStaffId", target = "deliveryStaff.id")
    void updateEntityFromDTO(UpdateBookingDTO updateBookingDTO, @MappingTarget Booking booking);
}