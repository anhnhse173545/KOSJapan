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

    @PostMapping("/create-fish-pack-and-fish-pack-order-detail")
    public ResponseEntity<FishPackOrderDetailDTO> createFishPackOrderDetail(@RequestBody CreateFishPackDTO createFishPackDTO) {
        FishPackOrderDetail newFPOD = service.createFishPackAndFishPackOrderDetail(createFishPackDTO);
        return ResponseEntity.ok(service.mapToDTO(newFPOD));
    }

    @PutMapping("/{fish_pack_order_id}/update-pack-in-Order-Detail/{pack_id}")
    public ResponseEntity<FishPackOrderDetailDTO> updatePackInOrderDetail(@PathVariable String fish_pack_order_id,
                                                                          @PathVariable String pack_id,
                                                                          @RequestBody CreateFishPackDTO dto) {
        FishPackOrderDetail updateFPOD = service.updatePackInOrderDetail(fish_pack_order_id, pack_id, dto);
        return ResponseEntity.ok(service.mapToDTO(updateFPOD));
    }

    @DeleteMapping("/{fish_order_id}/delete")
    public ResponseEntity<String> deleteFishPackOrderDetail(@PathVariable String fish_order_id) {
        service.deleteFishPackOrderDetail(fish_order_id);
        return ResponseEntity.ok("Deleted Koi Pack Order Detail successfully");
    }



}
