package com.swp391.koi_ordering_system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

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
    private String mediaUrl;
}
