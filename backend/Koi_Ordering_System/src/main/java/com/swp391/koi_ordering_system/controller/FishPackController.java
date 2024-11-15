package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.request.CreateFishPackDTO;
import com.swp391.koi_ordering_system.dto.response.FishPackDTO;
import com.swp391.koi_ordering_system.model.FishPack;
import com.swp391.koi_ordering_system.service.FishPackService;
import jakarta.validation.Valid;
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

    @PutMapping("/{fish_pack_id}/update")
    public ResponseEntity<FishPackDTO> updateFishPack( @PathVariable String fish_pack_id,
                                                       @Valid @RequestBody CreateFishPackDTO fishPackDTO) {
        FishPack fishPack = fishPackService.updateFishPack(fish_pack_id, fishPackDTO);
        return ResponseEntity.ok(fishPackService.mapToDTO(fishPack));
    }

    @DeleteMapping("{fish_pack_id}/delete")
    public ResponseEntity<String> deleteFishPack(@PathVariable String fish_pack_id) {
        fishPackService.deleteFishPack(fish_pack_id);
        return ResponseEntity.ok("Fish pack deleted successfully.");
    }

}
