package com.swp391.koi_ordering_system.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateAccountDTO {
    @NotNull(message = "Name cannot be null")
    @NotBlank(message = "Name must not be empty")
    private String name;

    @NotNull
    @NotBlank
    @Email(message = "Email should be valid")
    private String email;

    @NotNull(message = "Password cannot be null")
    @Size(min = 8, max = 30, message = "Password must be between 8 and 30 characters")
    private String password;

    @Pattern(regexp = "^\\d{10}$", message = "Phone number is invalid")
    @NotBlank(message = "Phone must not be empty")
    private String phone;

    @NotNull(message = "Address must not be null")
    @NotBlank
    private String address;

    private String role;
    private String profile_image;
}
