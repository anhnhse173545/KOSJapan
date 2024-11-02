package com.swp391.koi_ordering_system.dto.request;

import com.swp391.koi_ordering_system.dto.response.TripDestinationDTO;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateTripDTO {
    
    @FutureOrPresent(message = "visit date must be in the future or present")
    @DateTimeFormat(pattern = "YYYY-MM-DD HH:MM")
    private LocalDateTime startDate;

    @Future(message = "End date must be in the future")
    @DateTimeFormat(pattern = "YYYY-MM-DD HH:MM")
    private LocalDateTime endDate;

    @NotBlank(message = "Departure Airport must not be empty")
    private String departureAirport;

    @Min(value = 0, message = "Price must not be negative")
    private Double price;

    @NotBlank(message = "Description must not empty")
    private String description;
}