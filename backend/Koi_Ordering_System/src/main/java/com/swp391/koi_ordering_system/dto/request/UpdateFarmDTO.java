package com.swp391.koi_ordering_system.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateFarmDTO {
    private String address;
    private String phoneNumber;
    private String name;
    private String image;
}