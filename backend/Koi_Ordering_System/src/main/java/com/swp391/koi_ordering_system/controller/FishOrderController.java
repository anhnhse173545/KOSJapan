package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.CreateOrderDTO;
import com.swp391.koi_ordering_system.dto.request.CreateOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateFishOrderDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateOrderDTO;
import com.swp391.koi_ordering_system.dto.response.FishOrderDTO;
import com.swp391.koi_ordering_system.dto.response.FishOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.response.OrderDTO;
import com.swp391.koi_ordering_system.model.FishOrder;
import com.swp391.koi_ordering_system.model.FishOrderDetail;
import com.swp391.koi_ordering_system.repository.FishOrderDetailRepository;
import com.swp391.koi_ordering_system.service.FishOrderDetailService;
import com.swp391.koi_ordering_system.service.FishOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fish-order")
public class FishOrderController {

    @Autowired
    private FishOrderService orderService;

    @GetMapping("/all")
    public ResponseEntity<List<FishOrderDTO>> getAllFishOrders() {
         return ResponseEntity.ok(orderService.getAllFishOrder());
    }

    @GetMapping("/{booking_id}/all")
    public ResponseEntity<List<FishOrderDTO>> getAllFishOrdersByBookingId(@PathVariable String booking_id) {
        return ResponseEntity.ok(orderService.getAllByBookingId(booking_id));
    }

    @GetMapping("/{booking_id}/{farm_id}/detail")
    public ResponseEntity<List<FishOrderDTO>> getFishOrderDetail(@PathVariable String booking_id,
                                                             @PathVariable String farm_id) {
        return ResponseEntity.ok(orderService.getFishOrderByBookingIdAndFarmId(booking_id, farm_id));
    }

    @PostMapping("/{booking_id}/create")
    public ResponseEntity<FishOrderDTO> createFishOrder(@PathVariable String booking_id,
                                                    @RequestBody CreateOrderDTO createOrderDTO) {
        FishOrder newOrder = orderService.createFishOrder(booking_id, createOrderDTO);
        return ResponseEntity.ok(orderService.mapToDTO2(newOrder));
    }

    @PutMapping("/{booking_id}/{farm_id}/update")
    public ResponseEntity<FishOrderDTO> updateFishOrder(@PathVariable String booking_id,
                                                    @PathVariable String farm_id,
                                                    @RequestBody UpdateFishOrderDTO dto) {
        FishOrder updateOrder = orderService.updateFishOrder(booking_id, farm_id, dto);
        return ResponseEntity.ok(orderService.mapToDTO2(updateOrder));
    }

    @PutMapping("/{booking_id}/{farm_id}/add-order-detail-to-order")
    public ResponseEntity<FishOrderDTO> addFishOrderDetailToOrder(@PathVariable String booking_id,
                                                              @PathVariable String farm_id,
                                                              @RequestBody CreateOrderDTO dto){
        FishOrder addedOrder = orderService.addFishPackOrFishOrderDetailToOrder(booking_id, farm_id, dto);
        return ResponseEntity.ok(orderService.mapToDTO2(addedOrder));
    }

    @PutMapping("/{booking_id}/{farm_id}/update-order-detail-in-order")
    public ResponseEntity<FishOrderDTO> updateFishOrderDetailInOrder(@PathVariable String booking_id,
                                                                 @PathVariable String farm_id,
                                                                 @RequestBody UpdateOrderDTO dto){
        FishOrder updatedOrder = orderService.updateOrder(booking_id, farm_id, dto);
        return ResponseEntity.ok(orderService.mapToDTO2(updatedOrder));
    }

    @PutMapping("/{booking_id}/{farm_id}/remove-order-detail-from-order")
    public ResponseEntity<FishOrderDTO> removeFishOrderDetailFromOrder(@PathVariable String booking_id,
                                                                   @PathVariable String farm_id){
        FishOrder removedOrder = orderService.removeFishOrFishPackDetailInOrder(booking_id, farm_id);
        return ResponseEntity.ok(orderService.mapToDTO2(removedOrder));
    }

    @DeleteMapping("{booking_id}/{farm_id}/delete")
    public ResponseEntity<String> deleteFishOrder(@PathVariable String booking_id,
                                                  @PathVariable String farm_id) {
        orderService.deleteFishOrder(booking_id, farm_id);
        return ResponseEntity.ok("Deleted Fish Order: ");
    }

}
