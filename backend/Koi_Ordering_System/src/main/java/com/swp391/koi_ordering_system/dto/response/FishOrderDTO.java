package com.swp391.koi_ordering_system.dto.response;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FishOrderDTO {
    private String id;
    private String deliveryAddress;
    private String status;
    private Double total;
}
