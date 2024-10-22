package com.swp391.koi_ordering_system.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class    RegisterRequestDTO {
    private String name;
    private String email;
    private String phone;
    private String password;
    private String address;
    private String role;
}
