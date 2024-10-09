package com.swp391.koi_ordering_system.dto.request;

import com.swp391.koi_ordering_system.dto.response.VarietyDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateFarmDTO {
    @NotBlank(message = "farm's address is required")
    private String address;

    @Pattern(regexp = "^\\d{10}$", message = "phone number is invalid")
    private String phoneNumber;

    @NotBlank(message = "farm's name is required")
    private String name;

    private String image;

    private Set<VarietyDTO> varieties;
}