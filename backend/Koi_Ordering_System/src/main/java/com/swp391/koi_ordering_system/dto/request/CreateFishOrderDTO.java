package com.swp391.koi_ordering_system.dto.request;

import com.swp391.koi_ordering_system.dto.response.FishPackOrderDetailDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateFishOrderDTO {
    private String id;
    private String bookingId;
    private String farmId;
    private String deliveryAddress;
    private Double total;
    private LocalDateTime createAt;
    private LocalDateTime arrive_date;
    private String status;
    private Set<FishPackOrderDetailDTO> fishPackOrderDetails;
}
