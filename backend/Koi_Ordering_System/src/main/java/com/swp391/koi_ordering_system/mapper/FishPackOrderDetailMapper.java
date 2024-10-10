package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.response.FishPackOrderDetailDTO;
import com.swp391.koi_ordering_system.model.FishPackOrderDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FishPackOrderDetailMapper {
    @Mapping(source = "fishPack", target = "fishPack")
    FishPackOrderDetailDTO toDTO(FishPackOrderDetail fishPackOrderDetail);

    FishPackOrderDetail toEntity(FishPackOrderDetailDTO fishPackOrderDetailDTO);
}