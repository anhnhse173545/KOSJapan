package com.swp391.koi_ordering_system.dto.response;

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
public class TripDTO {
    private String id;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String departureAirport;    
    private String description;
    private Double price;
    private String status;
    private Set<TripDestinationDTO> tripDestinations;
}