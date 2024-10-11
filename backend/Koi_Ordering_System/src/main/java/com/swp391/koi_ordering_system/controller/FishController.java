package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.CreateFishDTO;
import com.swp391.koi_ordering_system.dto.response.FishDTO;
import com.swp391.koi_ordering_system.model.Fish;
import com.swp391.koi_ordering_system.repository.FishRepository;
import com.swp391.koi_ordering_system.service.FishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fish")
public class FishController {

    @Autowired
    private FishRepository fishRepository;

    @Autowired
    private FishService fishService;

    @GetMapping("/all")
    ResponseEntity<List<Fish>> getAllFish() {
        List<Fish> fishList = fishRepository.findAll();
        return ResponseEntity.ok(fishList);
    }

    @GetMapping("/{variety_id}/all")
    ResponseEntity<List<FishDTO>> getAllFishByVarietyId(@PathVariable String variety_id) {
        List<FishDTO> newlist = fishService.getAllVarietyId(variety_id);
        if (newlist.isEmpty()) {
            ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(newlist);
    }

    @GetMapping("/{fish_id}")
    ResponseEntity<Fish> getFishById(@PathVariable String fish_id) {
        Fish foundFish = fishRepository.findFishById(fish_id);
        if (foundFish == null) {
            ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(foundFish);
    }

    @PostMapping (value = "/{variety_id}/create")
    ResponseEntity<Fish> createFish(@PathVariable String variety_id, @RequestBody Fish fish){
        Fish newFish = fishService.createFish(fish, variety_id);
        return ResponseEntity.ok(newFish);
    }


    @PutMapping("/{fish_id}/update")
    ResponseEntity<FishDTO> updateFish(@PathVariable String fish_id, @RequestBody CreateFishDTO fishDTO) {
        Fish updateFish = fishService.updateFish(fish_id, fishDTO);
        FishDTO showFish = fishService.mapToDTO(updateFish);
        return ResponseEntity.ok(showFish);
    }

    @DeleteMapping("/{fish_id}/delete")
    ResponseEntity<String> deleteFish(@PathVariable String fish_id) {
        fishService.deleteFish(fish_id);
        return ResponseEntity.ok("Fish deleted successfully");
    }

}
