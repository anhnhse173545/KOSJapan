package com.swp391.koi_ordering_system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FishDTO {
    private String fish_id;
    private String fish_variety_name;
    private Double length;
    private Double weight;
    private String description;
}
