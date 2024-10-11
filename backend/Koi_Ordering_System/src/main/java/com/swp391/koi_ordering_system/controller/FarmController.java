package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.CreateFarmDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateFarmDTO;
import com.swp391.koi_ordering_system.dto.response.FarmDTO;
import com.swp391.koi_ordering_system.mapper.FarmMapper;
import com.swp391.koi_ordering_system.model.Farm;
import com.swp391.koi_ordering_system.service.FarmService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/farm")
public class FarmController {
    @Autowired
    private FarmService farmService;

    @Autowired
    private FarmMapper farmMapper;

//    @RequestMapping("/create")
//    public ResponseEntity<Farm> createFarm(@RequestBody Farm farm) {
//        return ResponseEntity.ok(farmService.createFarm(farm));
//    }

    @PostMapping("/create")
    public ResponseEntity<FarmDTO> createFarm(@Valid @RequestBody CreateFarmDTO createFarmDTO) {
        Farm farm = farmMapper.toEntity(createFarmDTO);
        return ResponseEntity.ok(farmMapper.toDTO(farmService.createFarm(farm)));
    }

    @GetMapping("/list")
    public ResponseEntity<List<FarmDTO>> getAllFarm() {
        return ResponseEntity.ok(farmService.getAllFarm());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Optional<FarmDTO>> getFarmById(@PathVariable String id) {
        Optional<FarmDTO> farm = farmService.getFarmById(id);
        if (farm.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(farm);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<FarmDTO> updatedFarm(@PathVariable String id, @Valid @RequestBody UpdateFarmDTO updateFarmDTO) {
        FarmDTO updatedFarm = farmService.updateFarm(id, updateFarmDTO);
        if (updatedFarm == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedFarm);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFarm(@PathVariable String id) {
        farmService.deleteFarm(id);
        return ResponseEntity.ok("Farm deleted successfully");
    }

    @PostMapping("/{farmId}/add-variety/{varietyId}")
    public ResponseEntity<Farm> addVarietyToFarm(@PathVariable String farmId, @PathVariable String varietyId) {
        Farm updatedFarm = farmService.addVarietyToFarm(farmId, varietyId);
        if (updatedFarm == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedFarm);
    }
}
