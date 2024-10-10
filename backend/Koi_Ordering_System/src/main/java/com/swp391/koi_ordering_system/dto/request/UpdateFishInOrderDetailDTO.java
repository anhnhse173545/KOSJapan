package com.swp391.koi_ordering_system.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateFishInOrderDetailDTO {
    private String orderDetailId;
    private String fishId;
    private Double orderDetailPrice;
}
