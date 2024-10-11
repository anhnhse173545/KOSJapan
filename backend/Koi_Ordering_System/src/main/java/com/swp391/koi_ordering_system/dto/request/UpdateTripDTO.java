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
public class UpdateTripDTO {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String departureAirport;
    private String description;
    private Double price;
    private String status;
}