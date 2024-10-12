package com.swp391.koi_ordering_system.dto.request;

import com.swp391.koi_ordering_system.dto.response.TripDestinationDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateTripDTO {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String departureAirport;
    private Double price;
    private String description;
}