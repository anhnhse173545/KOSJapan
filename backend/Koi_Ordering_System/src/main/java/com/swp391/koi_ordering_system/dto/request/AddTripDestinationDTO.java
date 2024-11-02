package com.swp391.koi_ordering_system.dto.request;

import com.swp391.koi_ordering_system.dto.response.FarmDTO;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class AddTripDestinationDTO {
    @NotNull(message = "Farm ID cannot be null")
    @NotBlank
    @Pattern(regexp = "^FA\\d{4}$", message = "ID must be in pattern [FA000X]")
    private String farmId;

    @NotNull(message = "Visit date cannot be null")
    @FutureOrPresent(message = "visit date must be in the future or present")
    @DateTimeFormat(pattern = "YYYY-MM-DD HH:MM")
    private LocalDateTime visitDate;

    @NotBlank(message = "Description can not be empty")
    private String description;
}
