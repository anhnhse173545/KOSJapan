package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.CreateFishDTO;
import com.swp391.koi_ordering_system.dto.response.FishDTO;
import com.swp391.koi_ordering_system.model.Fish;
import com.swp391.koi_ordering_system.model.Variety;
import com.swp391.koi_ordering_system.repository.FishRepository;
import com.swp391.koi_ordering_system.repository.VarietyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FishService {
    @Autowired
    private FishRepository fishRepository;

    @Autowired
    private VarietyRepository varietyRepository;

    public List<FishDTO> getAllVarietyId(String id){
        List<Fish> fishList = fishRepository.findByVarietyId(id);
        return fishList.stream()
                .map((Fish) -> mapToDTO(Fish))
                .collect(Collectors.toList());
    }

    public Fish createFish(CreateFishDTO fish, String varietyId){
        Fish newFish = new Fish();
        newFish.setId(generateFishId());
        Variety variety = varietyRepository.findById(varietyId).get();
        if(variety == null){
            throw new RuntimeException("Variety id not found");
        }
        newFish.setVariety(variety);
        newFish.setLength(fish.getLength());
        newFish.setWeight(fish.getWeight());
        newFish.setDescription(fish.getDescription());

        return fishRepository.save(newFish);
    }

    public Fish updateFish(String fishId, CreateFishDTO fishDTO) {
        Fish fish = fishRepository.findById(fishId)
                .orElseThrow(() -> new RuntimeException("Fish not found"));

        fish.setId(fishId);

        if(fishDTO.getVariety_id() != null){
            Variety variety = varietyRepository.findById(fishDTO.getVariety_id())
                    .orElseThrow(() -> new RuntimeException("Variety not found"));
            fish.setVariety(variety);
            fish.setWeight(fishDTO.getWeight());
            fish.setLength(fishDTO.getLength());
            fish.setDescription(fishDTO.getDescription());
        }
        return fishRepository.save(fish);
    }

    public void deleteFish(String fishID){
        Fish foundfish = fishRepository.findFishById(fishID);
        if(foundfish != null){
            foundfish.setIsDeleted(true);
            fishRepository.save(foundfish);
        }
        throw new RuntimeException("Fish not found");
    }

    public FishDTO mapToDTO(Fish fish){
        FishDTO fishDTO = new FishDTO();

        if(fish == null){
            return null;
        }

        fishDTO.setFish_id(fish.getId());
        fishDTO.setFish_variety_name(fish.getVariety().getName());
        fishDTO.setWeight(fish.getWeight());
        fishDTO.setLength(fish.getLength());
        fishDTO.setDescription(fish.getDescription());

        return fishDTO;
    }


    public String generateFishId() {
        String lastFishId = fishRepository.findTopByOrderByIdDesc()
                .map(Fish::getId)
                .orElse("KF0000");
        int nextId = Integer.parseInt(lastFishId.substring(2)) + 1;
        return String.format("KF%04d", nextId);
    }


}
