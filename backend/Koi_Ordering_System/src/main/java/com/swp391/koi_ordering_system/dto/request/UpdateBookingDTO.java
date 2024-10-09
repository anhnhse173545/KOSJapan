package com.swp391.koi_ordering_system.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateBookingDTO {
    private String tripId;
    private String description;

    @Pattern(regexp = "^(Requested|Pending Quota|Accepted|Confirmed|On-going|Pending Delivery|Rejected|Refund|null)$", message = "status is invalid")
    private String status;
    private String saleStaffId;
    private String consultingStaffId;
    private String deliveryStaffId;
}
