package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.response.FishPackDTO;
import com.swp391.koi_ordering_system.model.FishPack;
import com.swp391.koi_ordering_system.model.Media;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface FishPackMapper {

    @Mapping(source = "medias", target = "mediaUrls", qualifiedByName = "mediaToUrls")
    FishPackDTO toDTO(FishPack fishPack);

    FishPack toEntity(FishPackDTO fishPackDTO);

    @Named("mediaToUrls")
    default List<String> mediaToUrls(Set<Media> medias) {
        return medias.stream().map(Media::getUrl).collect(Collectors.toList());
    }
}