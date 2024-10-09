package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.response.FishPackOrderDetailDTO;
import com.swp391.koi_ordering_system.model.FishPackOrderDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FishPackOrderDetailMapper {
    @Mapping(source = "fishPack.id", target = "fishPacks.id")
    @Mapping(source = "fishPack.length", target = "fishPacks.length")
    @Mapping(source = "fishPack.weight", target = "fishPacks.weight")
    @Mapping(source = "fishPack.description", target = "fishPacks.description")
    @Mapping(source = "fishPack.quantity", target = "fishPacks.quantity")
    @Mapping(source = "price", target = "price")
    FishPackOrderDetailDTO toDTO(FishPackOrderDetail fishPackOrderDetail);

    @Mapping(source = "fishPacks.id", target = "fishPack.id")
    @Mapping(source = "fishPacks.length", target = "fishPack.length")
    @Mapping(source = "fishPacks.weight", target = "fishPack.weight")
    @Mapping(source = "fishPacks.description", target = "fishPack.description")
    @Mapping(source = "fishPacks.quantity", target = "fishPack.quantity")
    @Mapping(source = "price", target = "price")
    FishPackOrderDetail toEntity(FishPackOrderDetailDTO fishPackOrderDetailDTO);
}