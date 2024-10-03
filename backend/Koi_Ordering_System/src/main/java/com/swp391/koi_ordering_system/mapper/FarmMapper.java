package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.request.CreateFarmDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateFarmDTO;
import com.swp391.koi_ordering_system.dto.response.FarmDTO;
import com.swp391.koi_ordering_system.model.Farm;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FarmMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "address", target = "address")
    @Mapping(source = "phoneNumber", target = "phoneNumber")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "varieties", target = "varieties")
    FarmDTO toDTO(Farm farm);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "address", target = "address")
    @Mapping(source = "phoneNumber", target = "phoneNumber")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "varieties", target = "varieties")
    Farm toEntity(FarmDTO farmDTO);

    @Mapping(source = "address", target = "address")
    @Mapping(source = "phoneNumber", target = "phoneNumber")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "varieties", target = "varieties")
    Farm toEntity(CreateFarmDTO createFarmDTO);

    @Mapping(source = "address", target = "address")
    @Mapping(source = "phoneNumber", target = "phoneNumber")
    @Mapping(source = "name", target = "name")
    void updateEntityFromDTO(UpdateFarmDTO updateFarmDTO, @MappingTarget Farm farm);
}