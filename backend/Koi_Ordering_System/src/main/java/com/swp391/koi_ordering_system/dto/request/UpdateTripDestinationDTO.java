package com.swp391.koi_ordering_system.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UpdateTripDestinationDTO {
    private String farmId;
    private LocalDateTime visitDate;
    private String description;
}
