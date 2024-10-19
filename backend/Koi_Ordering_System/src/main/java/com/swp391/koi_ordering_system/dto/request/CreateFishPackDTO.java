package com.swp391.koi_ordering_system.dto.request;

import com.swp391.koi_ordering_system.model.Variety;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateFishPackDTO {
    private String length;
    private String weight;
    private String description;
    private Integer quantity;
    private Double packOrderDetailPrice;
}
