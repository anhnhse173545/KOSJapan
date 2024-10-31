package com.swp391.koi_ordering_system.dto.request;

import com.swp391.koi_ordering_system.model.Variety;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateFishPackDTO {
    @NotNull(message = "Order ID must not be null")
    @NotBlank(message = "Order ID must not be empty")
    @Pattern(regexp = "^PO\\d{4}$", message = "ID must be in pattern [PO000X]")
    private String orderId;

    @NotNull(message = "Variety ID must not be null")
    @NotBlank(message = "Variety ID must not be empty")
    @Pattern(regexp = "^VA\\d{4}$", message = "ID must be in pattern [VA000X]")
    private String varietyId;

    @NotBlank
    private String length;

    @NotBlank
    private String weight;

    @NotBlank(message = "Description must not be empty")
    private String description;

    @Min(value = 2, message = "Fish Pack must greater than 2")
    private Integer quantity;

    @Min(value = 0, message = "Price must not be negative")
    private Double packOrderDetailPrice;
}
