package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.request.CreateBookingDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateBookingDTO;
import com.swp391.koi_ordering_system.dto.response.BookingDTO;
import com.swp391.koi_ordering_system.model.Account;
import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.Trip;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-10-08T23:41:17+0700",
    comments = "version: 1.5.2.Final, compiler: javac, environment: Java 17.0.11 (Oracle Corporation)"
)
@Component
public class BookingMapperImpl implements BookingMapper {

    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private TripMapper tripMapper;
    @Autowired
    private TripPaymentMapper tripPaymentMapper;

    @Override
    public BookingDTO toDTO(Booking booking) {
        if ( booking == null ) {
            return null;
        }

        BookingDTO bookingDTO = new BookingDTO();

        bookingDTO.setCustomer( accountMapper.toDTO( booking.getCustomer() ) );
        bookingDTO.setTrip( tripMapper.toDTO( booking.getTrip() ) );
        bookingDTO.setTripPayment( tripPaymentMapper.toDTO( booking.getTripPayment() ) );
        bookingDTO.setSaleStaff( accountMapper.toDTO( booking.getSaleStaff() ) );
        bookingDTO.setConsultingStaff( accountMapper.toDTO( booking.getConsultingStaff() ) );
        bookingDTO.setDeliveryStaff( accountMapper.toDTO( booking.getDeliveryStaff() ) );
        bookingDTO.setId( booking.getId() );
        bookingDTO.setDescription( booking.getDescription() );
        bookingDTO.setCreateAt( booking.getCreateAt() );
        bookingDTO.setStatus( booking.getStatus() );

        return bookingDTO;
    }

    @Override
    public Booking toEntity(BookingDTO bookingDTO) {
        if ( bookingDTO == null ) {
            return null;
        }

        Booking booking = new Booking();

        booking.setCustomer( accountMapper.toEntity( bookingDTO.getCustomer() ) );
        booking.setTrip( tripMapper.toEntity( bookingDTO.getTrip() ) );
        booking.setTripPayment( tripPaymentMapper.toEntity( bookingDTO.getTripPayment() ) );
        booking.setSaleStaff( accountMapper.toEntity( bookingDTO.getSaleStaff() ) );
        booking.setConsultingStaff( accountMapper.toEntity( bookingDTO.getConsultingStaff() ) );
        booking.setDeliveryStaff( accountMapper.toEntity( bookingDTO.getDeliveryStaff() ) );
        booking.setId( bookingDTO.getId() );
        booking.setDescription( bookingDTO.getDescription() );
        booking.setCreateAt( bookingDTO.getCreateAt() );
        booking.setStatus( bookingDTO.getStatus() );

        return booking;
    }

    @Override
    public Booking toEntity(CreateBookingDTO createBookingDTO) {
        if ( createBookingDTO == null ) {
            return null;
        }

        Booking booking = new Booking();

        booking.setCustomer( createBookingDTOToAccount( createBookingDTO ) );
        booking.setDescription( createBookingDTO.getDescription() );

        return booking;
    }

    @Override
    public void updateEntityFromDTO(UpdateBookingDTO updateBookingDTO, Booking booking) {
        if ( updateBookingDTO == null ) {
            return;
        }

        if ( booking.getTrip() == null ) {
            booking.setTrip( new Trip() );
        }
        updateBookingDTOToTrip( updateBookingDTO, booking.getTrip() );
        if ( booking.getSaleStaff() == null ) {
            booking.setSaleStaff( new Account() );
        }
        updateBookingDTOToAccount( updateBookingDTO, booking.getSaleStaff() );
        if ( booking.getConsultingStaff() == null ) {
            booking.setConsultingStaff( new Account() );
        }
        updateBookingDTOToAccount1( updateBookingDTO, booking.getConsultingStaff() );
        if ( booking.getDeliveryStaff() == null ) {
            booking.setDeliveryStaff( new Account() );
        }
        updateBookingDTOToAccount2( updateBookingDTO, booking.getDeliveryStaff() );
        booking.setDescription( updateBookingDTO.getDescription() );
        booking.setStatus( updateBookingDTO.getStatus() );
    }

    protected Account createBookingDTOToAccount(CreateBookingDTO createBookingDTO) {
        if ( createBookingDTO == null ) {
            return null;
        }

        Account account = new Account();

        account.setId( createBookingDTO.getCustomerId() );

        return account;
    }

    protected void updateBookingDTOToTrip(UpdateBookingDTO updateBookingDTO, Trip mappingTarget) {
        if ( updateBookingDTO == null ) {
            return;
        }

        mappingTarget.setId( updateBookingDTO.getTripId() );
    }

    protected void updateBookingDTOToAccount(UpdateBookingDTO updateBookingDTO, Account mappingTarget) {
        if ( updateBookingDTO == null ) {
            return;
        }

        mappingTarget.setId( updateBookingDTO.getSaleStaffId() );
    }

    protected void updateBookingDTOToAccount1(UpdateBookingDTO updateBookingDTO, Account mappingTarget) {
        if ( updateBookingDTO == null ) {
            return;
        }

        mappingTarget.setId( updateBookingDTO.getConsultingStaffId() );
    }

    protected void updateBookingDTOToAccount2(UpdateBookingDTO updateBookingDTO, Account mappingTarget) {
        if ( updateBookingDTO == null ) {
            return;
        }

        mappingTarget.setId( updateBookingDTO.getDeliveryStaffId() );
    }
}
