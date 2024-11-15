package com.swp391.koi_ordering_system.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class  RegisterRequestDTO {
    @NotNull(message = "Name must not be null")
    @NotBlank(message = "Name must not be empty")
    private String name;

    @NotNull(message = "Email must not be null")
    @NotBlank(message = "Email must not be empty")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Phone number must not be empty")
    @NotNull(message = "Phone number must not be null")
    @Pattern(regexp = "^\\d{10}$", message = "phone number is invalid")
    private String phone;

    @NotEmpty(message = "Password cannot be null")
    @Size(min = 8, max = 30, message = "Password must be between 8 and 30 characters")
    @Pattern(regexp = "^\\S*$", message = "Password cannot contain spaces")
    private String password;

    private String address;

    @NotNull
    @NotBlank
    private String role;
}
