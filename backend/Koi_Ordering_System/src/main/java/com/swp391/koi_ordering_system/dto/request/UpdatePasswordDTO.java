package com.swp391.koi_ordering_system.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdatePasswordDTO {
    @NotNull
    @NotBlank
    private String phone;

    @NotNull
    @NotBlank
    private String oldPassword;

    @NotEmpty
    @Pattern(regexp = "^\\S*$", message = "Password cannot contain spaces")
    private String newPassword;
}
