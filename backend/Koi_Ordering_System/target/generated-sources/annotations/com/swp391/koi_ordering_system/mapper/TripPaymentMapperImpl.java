package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.request.CreateTripPaymentDTO;
import com.swp391.koi_ordering_system.dto.response.TripPaymentDTO;
import com.swp391.koi_ordering_system.model.PaymentMethod;
import com.swp391.koi_ordering_system.model.TripPayment;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-10-08T23:41:17+0700",
    comments = "version: 1.5.2.Final, compiler: javac, environment: Java 17.0.11 (Oracle Corporation)"
)
@Component
public class TripPaymentMapperImpl implements TripPaymentMapper {

    @Override
    public TripPaymentDTO toDTO(TripPayment tripPayment) {
        if ( tripPayment == null ) {
            return null;
        }

        TripPaymentDTO tripPaymentDTO = new TripPaymentDTO();

        tripPaymentDTO.setPaymentMethodName( tripPaymentPaymentMethodName( tripPayment ) );
        tripPaymentDTO.setId( tripPayment.getId() );
        if ( tripPayment.getAmount() != null ) {
            tripPaymentDTO.setAmount( tripPayment.getAmount() );
        }

        return tripPaymentDTO;
    }

    @Override
    public TripPayment toEntity(TripPaymentDTO tripPaymentDTO) {
        if ( tripPaymentDTO == null ) {
            return null;
        }

        TripPayment tripPayment = new TripPayment();

        tripPayment.setPaymentMethod( tripPaymentDTOToPaymentMethod( tripPaymentDTO ) );
        tripPayment.setId( tripPaymentDTO.getId() );
        tripPayment.setAmount( tripPaymentDTO.getAmount() );

        return tripPayment;
    }

    @Override
    public TripPayment toEntity(CreateTripPaymentDTO tripPaymentDTO) {
        if ( tripPaymentDTO == null ) {
            return null;
        }

        TripPayment tripPayment = new TripPayment();

        return tripPayment;
    }

    private String tripPaymentPaymentMethodName(TripPayment tripPayment) {
        if ( tripPayment == null ) {
            return null;
        }
        PaymentMethod paymentMethod = tripPayment.getPaymentMethod();
        if ( paymentMethod == null ) {
            return null;
        }
        String name = paymentMethod.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    protected PaymentMethod tripPaymentDTOToPaymentMethod(TripPaymentDTO tripPaymentDTO) {
        if ( tripPaymentDTO == null ) {
            return null;
        }

        PaymentMethod paymentMethod = new PaymentMethod();

        paymentMethod.setName( tripPaymentDTO.getPaymentMethodName() );

        return paymentMethod;
    }
}
