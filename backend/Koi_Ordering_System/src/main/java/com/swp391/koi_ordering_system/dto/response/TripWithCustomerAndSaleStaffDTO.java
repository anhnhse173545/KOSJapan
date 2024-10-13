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
public class TripWithCustomerAndSaleStaffDTO {
    private String id;
    private String description;
    private String bookingDescription;

    private String startDate;
    private String endDate;
    private String departureAirport;
    private String status;
    private AccountDTO customer;
    private AccountDTO saleStaff;
    private Set<TripDestinationDTO> tripDestinations;
    private Set<FishOrderDTO> fishOrders;
}