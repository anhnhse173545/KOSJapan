package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.CreateOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.response.FishOrderDTO;
import com.swp391.koi_ordering_system.dto.response.FishOrderDetailDTO;
import com.swp391.koi_ordering_system.model.FishOrderDetail;
import com.swp391.koi_ordering_system.repository.FishOrderDetailRepository;
import com.swp391.koi_ordering_system.service.FishOrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/fish-order")
public class FishOrderController {


    @Autowired
    private FishOrderDetailService fishOrderDetailService;

    @RequestMapping("/{order_id}/get-all-order-detail")
    public ResponseEntity<List<FishOrderDetailDTO>> getAllOrderDetailByOrderID (@PathVariable String order_id){
        List<FishOrderDetailDTO> list = fishOrderDetailService.findAllByOrderId(order_id);
        if(list.isEmpty()){
            ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(list);
    }

//    @RequestMapping("/{order_id}/add-order-detail-to-order")
//    public ResponseEntity<FishOrderDetailDTO> addOrderDetailToOrder(@PathVariable String order_id, @RequestBody CreateOrderDetailDTO dto){
//        FishOrderDetail enity = fishOrderDetailService.addOrderDetailToOrder(dto, order_id);
//        FishOrderDetailDTO fishOrderDetailDTO = fishOrderDetailService.mapToDTO(enity);
//        return ResponseEntity.ok(fishOrderDetailDTO);
//    }
}
