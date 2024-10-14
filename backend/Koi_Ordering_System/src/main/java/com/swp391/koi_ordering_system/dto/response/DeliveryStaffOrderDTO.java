package com.swp391.koi_ordering_system.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DeliveryStaffOrderDTO {
    private String id;
    private AccountDTO deliveryStaff;
    private String farmId;
    private String deliveryAddress;
    private String status;
    private Double total;
    private String bookingId;
    private List<FishOrderDetailDTO> fishOrderDetails;
    private List<FishPackOrderDetailDTO> fishPackOrderDetails;
}
