package com.swp391.koi_ordering_system.controller;


import com.swp391.koi_ordering_system.dto.request.CreateFishPackDTO;
import com.swp391.koi_ordering_system.dto.request.CreateOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.response.FishPackOrderDetailDTO;
import com.swp391.koi_ordering_system.model.FishPackOrderDetail;
import com.swp391.koi_ordering_system.service.FishPackOrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Koi-pack-Order-detail")
public class FishPackOrderDetailController {
    @Autowired
    private FishPackOrderDetailService service;

    @GetMapping("/all")
    public ResponseEntity<List<FishPackOrderDetailDTO>> getAll() {
        return ResponseEntity.ok(service.getAllFishPackOrderDetails());
    }

    @GetMapping("/{koi_pack_order_detail_id}")
    public ResponseEntity<FishPackOrderDetailDTO> getFishPackOrderDetail(@PathVariable String koi_pack_order_detail_id) {
        FishPackOrderDetail foundFPOD = service.getFishPackOrderDetailById(koi_pack_order_detail_id);
        return ResponseEntity.ok(service.mapToDTO(foundFPOD));
    }

    @GetMapping("/{fish_order_id}/all")
    public ResponseEntity<List<FishPackOrderDetailDTO>> findAllFishPackOrderDetailByOrderId(@PathVariable String fish_order_id) {
        return ResponseEntity.ok(service.getAllFishPackOrderDetailsByOrderId(fish_order_id));
    }

    @GetMapping("/{fish_order_id}/detail")
    public ResponseEntity<FishPackOrderDetailDTO> findFishPackOrderDetailByOrderId(@PathVariable String fish_order_id) {
        FishPackOrderDetail foungFPOD = service.findFishPackOrderDetailByOrderId(fish_order_id);
        return ResponseEntity.ok(service.mapToDTO(foungFPOD));
    }

    @PostMapping("/{fish_order_id}/create")
    public ResponseEntity<FishPackOrderDetailDTO> createFishPackOrderDetail(@PathVariable String fish_order_id,
                                                                            @RequestBody CreateOrderDetailDTO dto) {
        FishPackOrderDetail foundFPOD = service.createFishPackOrderDetail(fish_order_id, dto);
        return ResponseEntity.ok(service.mapToDTO(foundFPOD));
    }

    @PutMapping("/{fish_order_id}/update")
    public ResponseEntity<FishPackOrderDetailDTO> updatePackOrderDetail(@PathVariable String fish_order_id,
                                                                        @RequestBody FishPackOrderDetailDTO dto){
        FishPackOrderDetail updatedFOD = service.updateFishPackOrderDetail(fish_order_id, dto);
        return ResponseEntity.ok(service.mapToDTO(updatedFOD));
    }

    @PutMapping("/{fish_pack_order_id}/add-pack-to-order-detail/{fish_pack_id}")
    public ResponseEntity<FishPackOrderDetailDTO> addPackToOrderDetail(@PathVariable String fish_pack_order_id,
                                                                       @PathVariable String fish_pack_id) {
        FishPackOrderDetail addedfishPackOrderDetail = service.addPackToOrderDetail(fish_pack_order_id, fish_pack_id);
        return ResponseEntity.ok(service.mapToDTO(addedfishPackOrderDetail));
    }

    @PutMapping("/{fish_pack_order_id}/update-pack-in-Order-Detail/{pack_id}")
    public ResponseEntity<FishPackOrderDetailDTO> updatePackInOrderDetail(@PathVariable String fish_pack_order_id,
                                                                          @PathVariable String pack_id,
                                                                          @RequestBody CreateFishPackDTO dto) {
        FishPackOrderDetail updateFPOD = service.updatePackInOrderDetail(fish_pack_order_id, pack_id, dto);
        return ResponseEntity.ok(service.mapToDTO(updateFPOD));
    }

    @PutMapping("/{fish_pack_order_id}/remove-pack-out-of-order-detail")
    public ResponseEntity<FishPackOrderDetailDTO> removePackOutOfOrderDetail(@PathVariable String fish_pack_order_id) {
        FishPackOrderDetail removedFPOD = service.removeFishPackFromOrderDetail(fish_pack_order_id);
        return ResponseEntity.ok(service.mapToDTO(removedFPOD));
    }

    @DeleteMapping("/{fish_order_id}/delete")
    public ResponseEntity<String> deleteFishPackOrderDetail(@PathVariable String fish_order_id) {
        service.deleteFishPackOrderDetail(fish_order_id);
        return ResponseEntity.ok("Deleted Koi Pack Order Detail successfully");
    }



}
