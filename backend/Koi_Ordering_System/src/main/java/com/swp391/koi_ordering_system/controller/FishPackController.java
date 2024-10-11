package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.CreateFishDTO;
import com.swp391.koi_ordering_system.dto.request.CreateFishPackDTO;
import com.swp391.koi_ordering_system.dto.response.FishDTO;
import com.swp391.koi_ordering_system.dto.response.FishPackDTO;
import com.swp391.koi_ordering_system.model.FishPack;
import com.swp391.koi_ordering_system.service.FishPackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/koi-fish-pack")
public class FishPackController {

    @Autowired
    private FishPackService fishPackService;

    @GetMapping("/all")
    public ResponseEntity<List<FishPackDTO>> getAllKoiFishPacks() {
        List<FishPackDTO> packs = fishPackService.getAllFishPacks();
        return ResponseEntity.ok(packs);
    }

    @GetMapping("/{fish_pack_id}/detail")
    public ResponseEntity<FishPackDTO> getFishPackDetail(@PathVariable String fish_pack_id) {
        FishPackDTO fishPackDTO = fishPackService.getFishPackById(fish_pack_id);
        return ResponseEntity.ok(fishPackDTO);
    }

    @PostMapping("/create")
    public ResponseEntity<FishPackDTO> createFishPack(@RequestBody CreateFishPackDTO fishPack) {
        FishPack fishPackDTO = fishPackService.createFishPack(fishPack);
        return ResponseEntity.ok(fishPackService.mapToDTO(fishPackDTO));
    }

    @PutMapping("/{fish_pack_id}/update")
    public ResponseEntity<FishPackDTO> updateFishPack(@PathVariable String fish_pack_id,
                                                      @RequestBody CreateFishPackDTO fishPackDTO) {
        FishPack fishPack = fishPackService.updateFishPack(fish_pack_id, fishPackDTO);
        return ResponseEntity.ok(fishPackService.mapToDTO(fishPack));
    }

    @PostMapping("/{koi_pack_id}/add-fish-to-pack/{fish_id}")
    public ResponseEntity<FishPackDTO> addFishToPack(@PathVariable String fish_id,
                                                     @PathVariable String koi_pack_id) {
        FishPack fishPack = fishPackService.addFishToFishPack(fish_id, koi_pack_id);
        return ResponseEntity.ok(fishPackService.mapToDTO(fishPack));
    }

    @PutMapping("/{koi_pack_is}/update-fish-in-koi-pack/{fish_id}")
    public ResponseEntity<FishPackDTO> updateFishInKoiPack(@PathVariable String fish_id,
                                                           @PathVariable String koi_pack_id,
                                                           @RequestBody CreateFishPackDTO fishPackDTO,
                                                           @RequestBody CreateFishDTO fishDTO) {
        FishPack updateFishPack = fishPackService.updateFishInFishPack(fish_id, koi_pack_id, fishPackDTO, fishDTO);
        return ResponseEntity.ok(fishPackService.mapToDTO(updateFishPack));
    }

    @PutMapping("/{koi_pack_id}/remove-fish-from-koi-pack/{fish_id}")
    public ResponseEntity<FishPackDTO> removeFishFromKoiPack(@PathVariable String fish_id,
                                                             @PathVariable String koi_pack_id) {
        FishPack removedFishPack = fishPackService.removeFishFromFishPack(fish_id, koi_pack_id);
        return ResponseEntity.ok(fishPackService.mapToDTO(removedFishPack));
    }

    @DeleteMapping("{fish_pack_id}/delete")
    public ResponseEntity<String> deleteFishPack(@PathVariable String fish_pack_id) {
        fishPackService.deleteFishPack(fish_pack_id);
        return ResponseEntity.ok("Fish pack deleted successfully.");
    }


}
