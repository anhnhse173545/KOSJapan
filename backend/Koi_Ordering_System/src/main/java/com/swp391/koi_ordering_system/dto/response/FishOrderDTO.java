package com.swp391.koi_ordering_system.dto.response;

import com.swp391.koi_ordering_system.model.FishOrderDetail;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FishOrderDTO {
    private String id;
    private String bookingId;
    private AccountDTO customer;
    private AccountDTO consultingStaff;
    private AccountDTO deliveryStaff;
    private String farmId;
    private String deliveryAddress;
    private String status;
    private Double total;
    private String paymentStatus;
    private FishPaymentDTO payment;
    private List<FishOrderDetailDTO> fishOrderDetails;
    private List<FishPackOrderDetailDTO> fishPackOrderDetails;
}