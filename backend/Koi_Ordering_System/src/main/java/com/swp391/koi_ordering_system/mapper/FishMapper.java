package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.response.FishDTO;
import com.swp391.koi_ordering_system.model.Fish;
import com.swp391.koi_ordering_system.model.Media;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface FishMapper {


    @Mapping(source = "id", target = "fish_id")
    @Mapping(source = "variety.name", target = "fish_variety_name")

    FishDTO toDTO(Fish fish);

    @Mapping(source = "fish_id", target = "id")
    @Mapping(source = "fish_variety_name", target = "variety.name")
    
    Fish toEntity(FishDTO fishDTO);
}