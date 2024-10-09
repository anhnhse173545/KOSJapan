package com.swp391.koi_ordering_system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FishOrderDTO {
    private String id;
    private String deliveryAddress;
    private String status;
    private Double total;
    private Set<FishPackOrderDetailDTO> fishPackOrderDetails;
}