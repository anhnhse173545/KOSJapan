package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.request.CreateTripDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateTripDTO;
import com.swp391.koi_ordering_system.dto.response.TripDTO;
import com.swp391.koi_ordering_system.dto.response.TripDestinationDTO;
import com.swp391.koi_ordering_system.model.Trip;
import com.swp391.koi_ordering_system.model.TripDestination;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-10-08T23:41:17+0700",
    comments = "version: 1.5.2.Final, compiler: javac, environment: Java 17.0.11 (Oracle Corporation)"
)
@Component
public class TripMapperImpl implements TripMapper {

    @Autowired
    private TripDestinationMapper tripDestinationMapper;

    @Override
    public TripDTO toDTO(Trip trip) {
        if ( trip == null ) {
            return null;
        }

        TripDTO tripDTO = new TripDTO();

        tripDTO.setId( trip.getId() );
        tripDTO.setStartDate( trip.getStartDate() );
        tripDTO.setEndDate( trip.getEndDate() );
        tripDTO.setDepartureAirport( trip.getDepartureAirport() );
        tripDTO.setPrice( trip.getPrice() );
        tripDTO.setStatus( trip.getStatus() );
        tripDTO.setTripDestinations( tripDestinationSetToTripDestinationDTOSet( trip.getTripDestinations() ) );

        return tripDTO;
    }

    @Override
    public Trip toEntity(TripDTO tripDTO) {
        if ( tripDTO == null ) {
            return null;
        }

        Trip trip = new Trip();

        trip.setId( tripDTO.getId() );
        trip.setStartDate( tripDTO.getStartDate() );
        trip.setEndDate( tripDTO.getEndDate() );
        trip.setDepartureAirport( tripDTO.getDepartureAirport() );
        trip.setPrice( tripDTO.getPrice() );
        trip.setStatus( tripDTO.getStatus() );
        trip.setTripDestinations( tripDestinationDTOSetToTripDestinationSet( tripDTO.getTripDestinations() ) );

        return trip;
    }

    @Override
    public Trip toEntity(CreateTripDTO createTripDTO) {
        if ( createTripDTO == null ) {
            return null;
        }

        Trip trip = new Trip();

        trip.setStartDate( createTripDTO.getStartDate() );
        trip.setEndDate( createTripDTO.getEndDate() );
        trip.setDepartureAirport( createTripDTO.getDepartureAirport() );
        trip.setPrice( createTripDTO.getPrice() );

        return trip;
    }

    @Override
    public void updateEntityFromDTO(UpdateTripDTO updateTripDTO, Trip trip) {
        if ( updateTripDTO == null ) {
            return;
        }

        trip.setStartDate( updateTripDTO.getStartDate() );
        trip.setEndDate( updateTripDTO.getEndDate() );
        trip.setDepartureAirport( updateTripDTO.getDepartureAirport() );
        trip.setPrice( updateTripDTO.getPrice() );
        trip.setStatus( updateTripDTO.getStatus() );
    }

    protected Set<TripDestinationDTO> tripDestinationSetToTripDestinationDTOSet(Set<TripDestination> set) {
        if ( set == null ) {
            return null;
        }

        Set<TripDestinationDTO> set1 = new LinkedHashSet<TripDestinationDTO>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( TripDestination tripDestination : set ) {
            set1.add( tripDestinationMapper.toTripDestinationDTO( tripDestination ) );
        }

        return set1;
    }

    protected Set<TripDestination> tripDestinationDTOSetToTripDestinationSet(Set<TripDestinationDTO> set) {
        if ( set == null ) {
            return null;
        }

        Set<TripDestination> set1 = new LinkedHashSet<TripDestination>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( TripDestinationDTO tripDestinationDTO : set ) {
            set1.add( tripDestinationMapper.toTripDestination( tripDestinationDTO ) );
        }

        return set1;
    }
}
