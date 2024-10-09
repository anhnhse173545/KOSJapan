package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.response.FarmDTO;
import com.swp391.koi_ordering_system.dto.response.TripDestinationDTO;
import com.swp391.koi_ordering_system.dto.response.VarietyDTO;
import com.swp391.koi_ordering_system.model.Farm;
import com.swp391.koi_ordering_system.model.TripDestination;
import com.swp391.koi_ordering_system.model.Variety;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-10-08T23:41:18+0700",
    comments = "version: 1.5.2.Final, compiler: javac, environment: Java 17.0.11 (Oracle Corporation)"
)
@Component
public class TripDestinationMapperImpl implements TripDestinationMapper {

    @Override
    public TripDestinationDTO toTripDestinationDTO(TripDestination tripDestination) {
        if ( tripDestination == null ) {
            return null;
        }

        TripDestinationDTO tripDestinationDTO = new TripDestinationDTO();

        tripDestinationDTO.setId( tripDestination.getId() );
        tripDestinationDTO.setFarm( farmToFarmDTO( tripDestination.getFarm() ) );

        return tripDestinationDTO;
    }

    @Override
    public TripDestination toTripDestination(TripDestinationDTO tripDestinationDTO) {
        if ( tripDestinationDTO == null ) {
            return null;
        }

        TripDestination tripDestination = new TripDestination();

        tripDestination.setId( tripDestinationDTO.getId() );
        tripDestination.setFarm( farmDTOToFarm( tripDestinationDTO.getFarm() ) );

        return tripDestination;
    }

    protected VarietyDTO varietyToVarietyDTO(Variety variety) {
        if ( variety == null ) {
            return null;
        }

        VarietyDTO varietyDTO = new VarietyDTO();

        varietyDTO.setId( variety.getId() );
        varietyDTO.setName( variety.getName() );
        varietyDTO.setDescription( variety.getDescription() );

        return varietyDTO;
    }

    protected Set<VarietyDTO> varietySetToVarietyDTOSet(Set<Variety> set) {
        if ( set == null ) {
            return null;
        }

        Set<VarietyDTO> set1 = new LinkedHashSet<VarietyDTO>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( Variety variety : set ) {
            set1.add( varietyToVarietyDTO( variety ) );
        }

        return set1;
    }

    protected FarmDTO farmToFarmDTO(Farm farm) {
        if ( farm == null ) {
            return null;
        }

        FarmDTO farmDTO = new FarmDTO();

        farmDTO.setId( farm.getId() );
        farmDTO.setAddress( farm.getAddress() );
        farmDTO.setPhoneNumber( farm.getPhoneNumber() );
        farmDTO.setName( farm.getName() );
        farmDTO.setImage( farm.getImage() );
        farmDTO.setVarieties( varietySetToVarietyDTOSet( farm.getVarieties() ) );

        return farmDTO;
    }

    protected Variety varietyDTOToVariety(VarietyDTO varietyDTO) {
        if ( varietyDTO == null ) {
            return null;
        }

        Variety variety = new Variety();

        variety.setId( varietyDTO.getId() );
        variety.setName( varietyDTO.getName() );
        variety.setDescription( varietyDTO.getDescription() );

        return variety;
    }

    protected Set<Variety> varietyDTOSetToVarietySet(Set<VarietyDTO> set) {
        if ( set == null ) {
            return null;
        }

        Set<Variety> set1 = new LinkedHashSet<Variety>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( VarietyDTO varietyDTO : set ) {
            set1.add( varietyDTOToVariety( varietyDTO ) );
        }

        return set1;
    }

    protected Farm farmDTOToFarm(FarmDTO farmDTO) {
        if ( farmDTO == null ) {
            return null;
        }

        Farm farm = new Farm();

        farm.setId( farmDTO.getId() );
        farm.setAddress( farmDTO.getAddress() );
        farm.setPhoneNumber( farmDTO.getPhoneNumber() );
        farm.setName( farmDTO.getName() );
        farm.setImage( farmDTO.getImage() );
        farm.setVarieties( varietyDTOSetToVarietySet( farmDTO.getVarieties() ) );

        return farm;
    }
}
