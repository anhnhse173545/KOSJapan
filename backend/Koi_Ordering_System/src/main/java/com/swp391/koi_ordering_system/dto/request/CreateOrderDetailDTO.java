package com.swp391.koi_ordering_system.dto.request;

import com.swp391.koi_ordering_system.model.Fish;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderDetailDTO {
    @NotNull(message = "Order ID must not be null")
    @NotBlank(message = "Order ID must not be empty")
    @Pattern(regexp = "^PO\\d{4}$", message = "ID must be in pattern [PO000X]")
    private String orderId;

    @NotNull(message = "Fish ID must not be null")
    @NotBlank(message = "Fish ID must not be empty")
    @Pattern(regexp = "^KF\\d{4}$", message = "ID must be in pattern [KF000X]")
    private String fish_id;

    @Min(value = 0, message = "Price must not be negative")
    private Double price;
}
