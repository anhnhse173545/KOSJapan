package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.response.FishOrderDetailDTO;
import com.swp391.koi_ordering_system.model.FishOrderDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {FishMapper.class})
public interface FishOrderDetailMapper {


    @Mapping(source = "fish", target = "fish")
    @Mapping(source = "price", target = "price")
    FishOrderDetailDTO toDTO(FishOrderDetail fishOrderDetail);


    @Mapping(source = "fish", target = "fish")
    @Mapping(source = "price", target = "price")
    FishOrderDetail toEntity(FishOrderDetailDTO fishOrderDetailDTO);
}