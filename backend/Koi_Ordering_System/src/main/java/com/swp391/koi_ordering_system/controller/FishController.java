package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.CreateFishDTO;
import com.swp391.koi_ordering_system.dto.response.FishDTO;
import com.swp391.koi_ordering_system.model.Fish;
import com.swp391.koi_ordering_system.repository.FishRepository;
import com.swp391.koi_ordering_system.service.FishService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fish")
public class FishController {

    @Autowired
    private FishRepository fishRepository;

    @Autowired
    private FishService fishService;

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @GetMapping("/all")
    ResponseEntity<List<Fish>> getAllFish() {
        List<Fish> fishList = fishRepository.findAll();
        return ResponseEntity.ok(fishList);
    }

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @GetMapping("/{variety_id}/all")
    ResponseEntity<List<FishDTO>> getAllFishByVarietyId(@PathVariable String variety_id) {
        List<FishDTO> newlist = fishService.getAllVarietyId(variety_id);
        if (newlist.isEmpty()) {
            ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(newlist);
    }

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @GetMapping("/{fish_id}")
    ResponseEntity<Fish> getFishById(@PathVariable String fish_id) {
        Fish foundFish = fishRepository.findFishById(fish_id);
        if (foundFish == null) {
            ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(foundFish);
    }

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @PostMapping (value = "/{variety_id}/create")
    ResponseEntity<Fish> createFish(@Valid @PathVariable String variety_id, @RequestBody CreateFishDTO fish){
        Fish newFish = fishService.createFish(fish, variety_id);
        return ResponseEntity.ok(newFish);
    }

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @PutMapping("/{fish_id}/update")
    ResponseEntity<FishDTO> updateFish(@Valid @PathVariable String fish_id, @RequestBody CreateFishDTO fishDTO) {
        Fish updateFish = fishService.updateFish(fish_id, fishDTO);
        FishDTO showFish = fishService.mapToDTO(updateFish);
        return ResponseEntity.ok(showFish);
    }

    @PreAuthorize("hasAnyRole('Manager', 'Sales_Staff', 'Consulting_Staff', 'Delivery_Staff' , 'Customer')")
    @DeleteMapping("/{fish_id}/delete")
    ResponseEntity<String> deleteFish(@PathVariable String fish_id) {
        fishService.deleteFish(fish_id);
        return ResponseEntity.ok("Fish deleted successfully");
    }

}
