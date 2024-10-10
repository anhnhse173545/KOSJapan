package com.swp391.koi_ordering_system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TripDestinationDTO {
    private String id;
    private FarmDTO farm;
    private LocalDateTime visitDate;
    private String description;
}