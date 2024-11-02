package com.swp391.koi_ordering_system.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgetPasswordDTO {
    @NotBlank
    @NotNull
    @Pattern(regexp = "^\\d{10}$", message = "phone number is invalid")
    private String phone;

    @NotBlank(message = "Password must not be empty")
    private String password;
}
