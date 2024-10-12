package com.swp391.koi_ordering_system.dto.request;

import com.swp391.koi_ordering_system.dto.response.FishOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.response.FishPackOrderDetailDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderDTO {
    private String fish_order_detail_id;
    private String fish_pack_order_detail_id;
    private FishOrderDetailDTO fishOrderDTO;
    private FishPackOrderDetailDTO fishPackOrderDetailDTO;
}
