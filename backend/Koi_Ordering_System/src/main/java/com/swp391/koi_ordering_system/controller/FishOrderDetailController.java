package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.CreateOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateFishInOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.response.FishOrderDetailDTO;
import com.swp391.koi_ordering_system.model.FishOrderDetail;
import com.swp391.koi_ordering_system.service.FishOrderDetailService;
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

    @PostMapping("/{order_id}/create")
    public ResponseEntity<FishOrderDetailDTO> createOrderDetail(@PathVariable String order_id,
                                                             @RequestBody CreateOrderDetailDTO createOrderDetailDTO){
        FishOrderDetail newOrderDetail = service.createFishOrderDetail( createOrderDetailDTO, order_id);
        FishOrderDetailDTO showOrderDetail = service.mapToDTO(newOrderDetail);
        return ResponseEntity.ok(showOrderDetail);
    }

    @PostMapping("/{orderDetail_id}/add-fish-to-order-detail/{fish_id}")
    public ResponseEntity<FishOrderDetail> addFishToOrderDetail(@PathVariable String orderDetail_id,
                                                                @PathVariable String fish_id){
        FishOrderDetail addedOrderDetail = service.addFishToOrderDetail(fish_id, orderDetail_id);
        return ResponseEntity.ok(addedOrderDetail);
    }

    @PutMapping("/{orderDetail_id}/update-order-detail")
    public ResponseEntity<FishOrderDetail> updateFishInOrderDetail(@PathVariable String orderDetail_id,
                                                                   @RequestBody UpdateFishInOrderDetailDTO fishOrderDetailDTO){
        FishOrderDetail updatedOrderDetail = service.updateFishInOrderDetail(orderDetail_id, fishOrderDetailDTO);
        return ResponseEntity.ok(updatedOrderDetail);
    }

    @PutMapping("/{orderDetail_id}/remove-fish-from-order-detail/{fish_id}")
    public ResponseEntity<FishOrderDetail> removeFishFromOrderDetail(@PathVariable String orderDetail_id,
                                                                     @PathVariable String fish_id){
        FishOrderDetail updatedOrderDetail = service.removeFishFromOrderDetail(fish_id, orderDetail_id);
        return ResponseEntity.ok(updatedOrderDetail);
    }

    @DeleteMapping("/{orderDetail_id}/delete")
    public ResponseEntity<String> deleteOrderDetail(@PathVariable String orderDetail_id){
        service.deleteFishOrderDetail(orderDetail_id);
        return ResponseEntity.ok("Order Detail deleted successfully");
    }


}