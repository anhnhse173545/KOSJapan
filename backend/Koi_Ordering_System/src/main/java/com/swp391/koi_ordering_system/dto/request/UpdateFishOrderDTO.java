package com.swp391.koi_ordering_system.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateFishOrderDTO {
    private String delivery_address;
    private Double total;
    private LocalDateTime arrived_date;
    private String status;
    private String paymentStatus;
}
