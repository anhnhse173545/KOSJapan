package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.response.VarietyDTO;
import com.swp391.koi_ordering_system.model.Variety;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VarietyMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "description", target = "description")
    VarietyDTO toDTO(Variety variety);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "description", target = "description")
    Variety toEntity(VarietyDTO varietyDTO);
}