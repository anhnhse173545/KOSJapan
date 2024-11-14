package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.UpdateFishOrderDTO;
import com.swp391.koi_ordering_system.dto.response.*;
import com.swp391.koi_ordering_system.model.FishOrder;
import com.swp391.koi_ordering_system.service.FishOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fish-order")
public class FishOrderController {

    @Autowired
    private FishOrderService orderService;
    @Autowired
    private FishOrderService fishOrderService;

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @GetMapping("/all")
    public ResponseEntity<List<FishOrderDTO>> getAllFishOrders() {
         return ResponseEntity.ok(orderService.getAllFishOrder());
    }

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @GetMapping("/{booking_id}/all")
    public ResponseEntity<List<FishOrderDTO>> getAllFishOrdersByBookingId(@PathVariable String booking_id) {
        return ResponseEntity.ok(orderService.getAllByBookingId(booking_id));
    }

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @GetMapping("/{booking_id}/{farm_id}/detail")
    public ResponseEntity<List<FishOrderDTO>> getFishOrderDetail(@PathVariable String booking_id,
                                                             @PathVariable String farm_id) {
        return ResponseEntity.ok(orderService.getFishOrderByBookingIdAndFarmId(booking_id, farm_id));
    }

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @PostMapping("/{booking_id}/{farm_id}/create")
    public ResponseEntity<FishOrderDTO> createFishOrder(@PathVariable String booking_id,
                                                    @PathVariable String farm_id,
                                                        @RequestParam String address) {
        FishOrder newOrder = orderService.createFishOrder(booking_id, farm_id, address);
        return ResponseEntity.ok(orderService.mapToDTO2(newOrder));
    }

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @PutMapping("/{booking_id}/{farm_id}/update")
    public ResponseEntity<FishOrderDTO> updateFishOrder(@PathVariable String booking_id,
                                                    @PathVariable String farm_id,
                                                    @RequestBody UpdateFishOrderDTO dto) {
        FishOrder updateOrder = orderService.updateFishOrder(booking_id, farm_id, dto);
        return ResponseEntity.ok(orderService.mapToDTO2(updateOrder));
    }

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @PostMapping("/{order_id}/remove-fish-order-detail-from-order/{fish_order_detail_id}")
    public ResponseEntity<FishOrderDTO> removeFishOrderDetailFromOrder(@PathVariable String order_id,
                                                                   @PathVariable String fish_order_detail_id){
        FishOrder removedOrder = orderService.removeFishOrderDetailInOrder(order_id, fish_order_detail_id);
        return ResponseEntity.ok(orderService.mapToDTO2(removedOrder));
    }

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @PostMapping("/{order_id}/remove-pack-order-detail-from-order/{fish_pack_order_detail_id}")
    public ResponseEntity<FishOrderDTO> removeFishPackOrderDetailFromOrder(@PathVariable String order_id,
                                                                       @PathVariable String fish_pack_order_detail_id){
        FishOrder removedOrder = orderService.removeFishPackDetailInOrder(order_id, fish_pack_order_detail_id);
        return ResponseEntity.ok(orderService.mapToDTO2(removedOrder));
    }

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @DeleteMapping("{booking_id}/{farm_id}/delete")
    public ResponseEntity<String> deleteFishOrder(@PathVariable String booking_id,
                                                  @PathVariable String farm_id) {
        orderService.deleteFishOrder(booking_id, farm_id);
        return ResponseEntity.ok("Deleted Fish Order: ");
    }

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @GetMapping("/delivery-staff/{deliveryId}")
    public ResponseEntity<?> getFishOrderByDeliveryId(@PathVariable String deliveryId) {
        List<FishOrderDTO> fishOrder = fishOrderService.getFishOrdersByDeliveryStaffId(deliveryId);
        if (fishOrder.isEmpty()) {
            ErrorDTO errorDTO = new ErrorDTO(404, "Order not found");
            return ResponseEntity.status(404).body(errorDTO);
        }
        return ResponseEntity.ok(fishOrder);
    }

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @GetMapping("/consulting-staff/{consultingId}")
    public ResponseEntity<?> getFishOrderByConsultingId(@PathVariable String consultingId) {
        List<FishOrderDTO> fishOrder = fishOrderService.getFishOrdersByConsultingStaffId(consultingId);
        if (fishOrder.isEmpty()) {
            ErrorDTO errorDTO = new ErrorDTO(404, "Order not found");
            return ResponseEntity.status(404).body(errorDTO);
        }
        return ResponseEntity.ok(fishOrder);
    }

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @GetMapping("/delivery-staff/{deliveryId}/{status}")
    public ResponseEntity<?> getFishOrderByDeliveryIdAndStatus(@PathVariable String deliveryId,
                                                               @PathVariable String status) {
        List<FishOrderDTO> list = fishOrderService.getFishOrderByStatusByDeliveryStaff(deliveryId,status);
        if(list.isEmpty()){
            return ResponseEntity.status(404).body(new ErrorDTO(404, "Order not found"));
        }
        return ResponseEntity.ok(list);
    }

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
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
