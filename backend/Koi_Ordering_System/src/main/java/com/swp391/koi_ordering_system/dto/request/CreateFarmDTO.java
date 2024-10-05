package com.swp391.koi_ordering_system.dto.request;

import com.swp391.koi_ordering_system.dto.response.VarietyDTO;
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
    private String address;
    private String phoneNumber;
    private String name;
    private String image;
    private Set<VarietyDTO> varieties;
}