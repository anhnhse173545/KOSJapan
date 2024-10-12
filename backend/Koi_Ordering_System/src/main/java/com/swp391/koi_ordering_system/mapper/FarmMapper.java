package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.request.CreateFarmDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateFarmDTO;
import com.swp391.koi_ordering_system.dto.response.FarmDTO;
import com.swp391.koi_ordering_system.model.Farm;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FarmMapper {

    FarmDTO toDTO(Farm farm);

    Farm toEntity(FarmDTO farmDTO);

    Farm toEntity(CreateFarmDTO createFarmDTO);

    void updateEntityFromDTO(UpdateFarmDTO updateFarmDTO, @MappingTarget Farm farm);
}