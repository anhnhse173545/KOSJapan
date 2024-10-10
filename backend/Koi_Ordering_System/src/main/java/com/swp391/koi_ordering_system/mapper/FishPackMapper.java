// FishPackMapper.java
package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.response.FishPackDTO;
import com.swp391.koi_ordering_system.model.FishPack;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FishPackMapper {


    FishPackDTO toDTO(FishPack fishPack);

    FishPack toEntity(FishPackDTO fishPackDTO);
}