package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.response.VarietyDTO;
import com.swp391.koi_ordering_system.service.VarietyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/variety")
public class VarietyController {
    @Autowired
    private VarietyService varietyService;

    @PostMapping("/create")
    public ResponseEntity<VarietyDTO> createVariety(@RequestBody VarietyDTO varietyDTO) {
        VarietyDTO createdVariety = varietyService.createVariety(varietyDTO);
        return ResponseEntity.ok(createdVariety);
    }

    @GetMapping("/list")
    public ResponseEntity<List<VarietyDTO>> getAllVarieties() {
        List<VarietyDTO> varieties = varietyService.getAllVarieties();
        return ResponseEntity.ok(varieties);
    }

    @GetMapping("get/{id}")
    public ResponseEntity<VarietyDTO> getVarietyById(@PathVariable String id) {
        Optional<VarietyDTO> variety = varietyService.getVarietyById(id);
        return variety.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("update/{id}")
    public ResponseEntity<VarietyDTO> updateVariety(@PathVariable String id, @RequestBody VarietyDTO varietyDTO) {
        VarietyDTO updatedVariety = varietyService.updateVariety(id, varietyDTO);
        return ResponseEntity.ok(updatedVariety);
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteVariety(@PathVariable String id) {
        varietyService.deleteVariety(id);
        return ResponseEntity.noContent().build();
    }
}