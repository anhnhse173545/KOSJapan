package com.swp391.koi_ordering_system.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateVarietyDTO {
    @NotBlank(message = "Name Variety must not be empty")
    private String name;

    @NotBlank(message = "Description must not be empty")
    private String description;
}
