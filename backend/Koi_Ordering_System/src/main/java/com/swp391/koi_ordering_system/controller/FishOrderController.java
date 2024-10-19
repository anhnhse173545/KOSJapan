package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.UpdateFishOrderDTO;
import com.swp391.koi_ordering_system.dto.response.*;
import com.swp391.koi_ordering_system.model.FishOrder;
import com.swp391.koi_ordering_system.service.FishOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fish-order")
public class FishOrderController {

    @Autowired
    private FishOrderService orderService;
    @Autowired
    private FishOrderService fishOrderService;

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

    @PostMapping("/{booking_id}/{farm_id}/create")
    public ResponseEntity<FishOrderDTO> createFishOrder(@PathVariable String booking_id,
                                                    @PathVariable String farm_id) {
        FishOrder newOrder = orderService.createFishOrder(booking_id, farm_id);
        return ResponseEntity.ok(orderService.mapToDTO2(newOrder));
    }

    @PutMapping("/{booking_id}/{farm_id}/update")
    public ResponseEntity<FishOrderDTO> updateFishOrder(@PathVariable String booking_id,
                                                    @PathVariable String farm_id,
                                                    @RequestBody UpdateFishOrderDTO dto) {
        FishOrder updateOrder = orderService.updateFishOrder(booking_id, farm_id, dto);
        return ResponseEntity.ok(orderService.mapToDTO2(updateOrder));
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

    @GetMapping("/delivery-staff/{deliveryId}")
    public ResponseEntity<?> getFishOrderByDeliveryId(@PathVariable String deliveryId) {
        List<DeliveryStaffOrderDTO> fishOrder = fishOrderService.getFishOrdersByDeliveryStaffId(deliveryId);
        if (fishOrder.isEmpty()) {
            ErrorDTO errorDTO = new ErrorDTO(404, "Order not found");
            return ResponseEntity.status(404).body(errorDTO);
        }
        return ResponseEntity.ok(fishOrder);
    }

    @GetMapping("/delivery-staff/{deliveryId}/{status}")
    public ResponseEntity<?> getFishOrderByDeliveryIdAndStatus(@PathVariable String deliveryId,
                                                               @PathVariable String status) {
        List<DeliveryStaffOrderDTO> list = fishOrderService.getFishOrderByStatusByDeliveryStaff(deliveryId,status);
        if(list.isEmpty()){
            return ResponseEntity.status(404).body(new ErrorDTO(404, "Order not found"));
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getFishOrderByCustomerId(@PathVariable String customerId) {
        List<FishOrderDTO> fishOrder = fishOrderService.getFishOrdersByCustomerId(customerId);
        if (fishOrder.isEmpty()) {
            ErrorDTO errorDTO = new ErrorDTO(404, "Order not found");
            return ResponseEntity.status(404).body(errorDTO);
        }
        return ResponseEntity.ok(fishOrder);
    }

}
