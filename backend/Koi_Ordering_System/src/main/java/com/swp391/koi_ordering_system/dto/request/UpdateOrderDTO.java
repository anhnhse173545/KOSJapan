package com.swp391.koi_ordering_system.dto.request;

import com.swp391.koi_ordering_system.dto.response.FishPackOrderDetailDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateOrderDTO {
    private UpdateFishInOrderDetailDTO updateFOD;
    private CreateFishPackDTO updateFPOD;
}
