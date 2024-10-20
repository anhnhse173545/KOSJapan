package com.swp391.koi_ordering_system.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateFishDTO {
    private String variety_id;
    private Double weight;
    private Double length;
    private String description;
    private String orderId;
    private Double price;
}
