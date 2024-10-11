package com.swp391.koi_ordering_system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FishPackDTO {
    private String id;
    private String length;
    private String weight;
    private String description;
    private List<FishDTO> listFish;
}
