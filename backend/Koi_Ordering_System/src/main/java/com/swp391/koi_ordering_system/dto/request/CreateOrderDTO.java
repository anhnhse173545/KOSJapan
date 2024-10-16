package com.swp391.koi_ordering_system.dto.request;

import com.swp391.koi_ordering_system.dto.response.FishOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.response.FishPackOrderDetailDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderDTO {
    private String deliveryAddress;
    private Double total;
    private LocalDateTime createAt;
    private LocalDateTime arrivedDate;
}
