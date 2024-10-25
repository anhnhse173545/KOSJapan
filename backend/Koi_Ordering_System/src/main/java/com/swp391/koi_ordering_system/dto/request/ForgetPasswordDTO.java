package com.swp391.koi_ordering_system.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgetPasswordDTO {
    private String phone;
    private String password;
}
