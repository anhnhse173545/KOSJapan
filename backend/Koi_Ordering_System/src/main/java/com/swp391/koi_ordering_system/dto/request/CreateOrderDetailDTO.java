package com.swp391.koi_ordering_system.dto.request;

import com.swp391.koi_ordering_system.model.Fish;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderDetailDTO {
    private String orderId;
    private String fish_id;
    private Double price;
}
