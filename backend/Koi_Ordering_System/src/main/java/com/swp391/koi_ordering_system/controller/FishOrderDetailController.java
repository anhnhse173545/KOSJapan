package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.CreateFishDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateFishInOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.response.FishOrderDetailDTO;
import com.swp391.koi_ordering_system.model.FishOrderDetail;
import com.swp391.koi_ordering_system.service.FishOrderDetailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order-detail")
public class FishOrderDetailController {

    @Autowired
    private FishOrderDetailService service;

    @GetMapping("/{order_id}/all")
    public ResponseEntity<List<FishOrderDetailDTO>> getAllOrderDetailByOrderId(@PathVariable String order_id) {
        List<FishOrderDetailDTO> list = service.findAllByOrderId(order_id);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/update-order-detail")
    public ResponseEntity<FishOrderDetail> updateFishInOrderDetail(@RequestBody UpdateFishInOrderDetailDTO fishOrderDetailDTO){
        FishOrderDetail updatedOrderDetail = service.updateFishInOrderDetail(fishOrderDetailDTO);
        return ResponseEntity.ok(updatedOrderDetail);
    }

    @DeleteMapping("/{orderDetail_id}/delete")
    public ResponseEntity<String> deleteOrderDetail(@PathVariable String orderDetail_id){
        service.deleteFishOrderDetail(orderDetail_id);
        return ResponseEntity.ok("Order Detail deleted successfully");
    }

    @PostMapping("/create-fish-and-order-detail")
    public ResponseEntity<FishOrderDetail> createFishAndOrderDetail(@Valid @RequestBody CreateFishDTO dto) {
        FishOrderDetail fishOrderDetail = service.createFishAndOrderDetail(dto);
        return ResponseEntity.ok(fishOrderDetail);
    }


}
