package com.swp391.koi_ordering_system.dto.response;

import com.swp391.koi_ordering_system.model.Fish;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FishOrderDetailDTO {
    private String id;
    private Fish fish;
    private Double fish_price;
}
