package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.response.VarietyDTO;
import com.swp391.koi_ordering_system.model.Variety;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-10-08T23:41:17+0700",
    comments = "version: 1.5.2.Final, compiler: javac, environment: Java 17.0.11 (Oracle Corporation)"
)
@Component
public class VarietyMapperImpl implements VarietyMapper {

    @Override
    public VarietyDTO toDTO(Variety variety) {
        if ( variety == null ) {
            return null;
        }

        VarietyDTO varietyDTO = new VarietyDTO();

        varietyDTO.setId( variety.getId() );
        varietyDTO.setName( variety.getName() );
        varietyDTO.setDescription( variety.getDescription() );

        return varietyDTO;
    }

    @Override
    public Variety toEntity(VarietyDTO varietyDTO) {
        if ( varietyDTO == null ) {
            return null;
        }

        Variety variety = new Variety();

        variety.setId( varietyDTO.getId() );
        variety.setName( varietyDTO.getName() );
        variety.setDescription( varietyDTO.getDescription() );

        return variety;
    }
}
