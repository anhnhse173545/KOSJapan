//package com.swp391.koi_ordering_system.mapper;
//
//import com.swp391.koi_ordering_system.dto.request.CreateBookingDTO;
//import com.swp391.koi_ordering_system.dto.request.UpdateBookingDTO;
//import com.swp391.koi_ordering_system.dto.response.BookingDTO;
//import com.swp391.koi_ordering_system.model.Booking;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//import org.mapstruct.MappingTarget;
//import org.mapstruct.factory.Mappers;
//
//@Mapper(componentModel = "spring")
//public interface BookingMapper {
//    BookingMapper INSTANCE = Mappers.getMapper(BookingMapper.class);
//
//    @Mapping(source = "customer.id", target = "customerId")
//    @Mapping(source = "trip.id", target = "tripId")
//    @Mapping(source = "tripPayment.id", target = "tripPaymentId")
//    @Mapping(source = "saleStaff.id", target = "saleStaffId")
//    @Mapping(source = "consultingStaff.id", target = "consultingStaffId")
//    @Mapping(source = "deliveryStaff.id", target = "deliveryStaffId")
//    BookingDTO toDTO(Booking booking);
//
//    @Mapping(source = "customerId", target = "customer.id")
//    @Mapping(source = "tripId", target = "trip.id")
//    @Mapping(source = "tripPaymentId", target = "tripPayment.id")
//    @Mapping(source = "saleStaffId", target = "saleStaff.id")
//    @Mapping(source = "consultingStaffId", target = "consultingStaff.id")
//    @Mapping(source = "deliveryStaffId", target = "deliveryStaff.id")
//    Booking toEntity(BookingDTO bookingDTO);
//
//    @Mapping(source = "customerId", target = "customer.id")
//    @Mapping(source = "description", target = "description")
//    Booking toEntity(CreateBookingDTO createBookingDTO);
//
//    @Mapping(source = "tripId", target = "trip.id")
//    @Mapping(source = "description", target = "description")
//    @Mapping(source = "status", target = "status")
//    @Mapping(source = "saleStaffId", target = "saleStaff.id")
//    @Mapping(source = "consultingStaffId", target = "consultingStaff.id")
//    @Mapping(source = "deliveryStaffId", target = "deliveryStaff.id")
//    void updateEntityFromDTO(UpdateBookingDTO updateBookingDTO, @MappingTarget Booking booking);
//}

package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.request.CreateBookingDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateBookingDTO;
import com.swp391.koi_ordering_system.dto.response.BookingDTO;
import com.swp391.koi_ordering_system.model.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {AccountMapper.class, TripMapper.class, TripPaymentMapper.class})
public interface BookingMapper {
    @Mapping(source = "customer", target = "customer")
    @Mapping(source = "trip", target = "trip")
    @Mapping(source = "tripPayment", target = "tripPayment")
    @Mapping(source = "saleStaff", target = "saleStaff")
    @Mapping(source = "consultingStaff", target = "consultingStaff")
    @Mapping(source = "deliveryStaff", target = "deliveryStaff")
    BookingDTO toDTO(Booking booking);

    @Mapping(source = "customer", target = "customer")
    @Mapping(source = "trip", target = "trip")
    @Mapping(source = "tripPayment", target = "tripPayment")
    @Mapping(source = "saleStaff", target = "saleStaff")
    @Mapping(source = "consultingStaff", target = "consultingStaff")
    @Mapping(source = "deliveryStaff", target = "deliveryStaff")
    Booking toEntity(BookingDTO bookingDTO);

        @Mapping(source = "customerId", target = "customer.id")
    @Mapping(source = "description", target = "description")
    Booking toEntity(CreateBookingDTO createBookingDTO);

    @Mapping(source = "tripId", target = "trip.id")
    @Mapping(source = "description", target = "description")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "saleStaffId", target = "saleStaff.id")
    @Mapping(source = "consultingStaffId", target = "consultingStaff.id")
    @Mapping(source = "deliveryStaffId", target = "deliveryStaff.id")
    void updateEntityFromDTO(UpdateBookingDTO updateBookingDTO, @MappingTarget Booking booking);
}