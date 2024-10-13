package com.swp391.koi_ordering_system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookingDTO {
    private String id;
    private AccountDTO customer;
    private TripDTO trip;
    private String description;
    private LocalDateTime createAt;
    private TripPaymentDTO tripPayment;
    private String status;
    private AccountDTO saleStaff;
    private AccountDTO consultingStaff;
    private AccountDTO deliveryStaff;
    private List<FishOrderDTO> fishOrders;
}