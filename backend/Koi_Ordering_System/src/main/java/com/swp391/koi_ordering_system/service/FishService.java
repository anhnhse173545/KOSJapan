package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.CreateFishDTO;
import com.swp391.koi_ordering_system.dto.response.FishDTO;
import com.swp391.koi_ordering_system.model.Fish;
import com.swp391.koi_ordering_system.model.FishOrderDetail;
import com.swp391.koi_ordering_system.model.Variety;
import com.swp391.koi_ordering_system.repository.FishRepository;
import com.swp391.koi_ordering_system.repository.VarietyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FishService {
    @Autowired
    private FishRepository fishRepository;

    @Autowired
    private VarietyRepository varietyRepository;

    private static final String PREFIX = "KF";
    private static final int ID_PADDING = 4;

    public List<FishDTO> getAllVarietyId(String id){
        List<Fish> fishList = fishRepository.findByVarietyId(id);
        return fishList.stream()
                .map((Fish) -> mapToDTO(Fish))
                .collect(Collectors.toList());
    }

    public Fish createFish(CreateFishDTO dto){
        Optional<Variety> variety = varietyRepository.findById(dto.getVariety_id());
        if(variety.isEmpty()){
            throw new RuntimeException("Variety id not found");
        }
        Fish fish = new Fish();

        fish.setId(generateFishId());
        fish.setVariety(variety.get());
        fish.setLength(dto.getLength());
        fish.setWeight(dto.getWeight());
        fish.setDescription(dto.getDescription());

        return fishRepository.save(fish);
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

        fishDTO.setFish_id(fish.getId());
        fishDTO.setFish_variety_name(fish.getVariety().getName());
        fishDTO.setWeight(fish.getWeight());
        fishDTO.setLength(fish.getLength());
        fishDTO.setDescription(fish.getDescription());

        return fishDTO;
    }


    private String generateFishId() {
        String lastId = fishRepository.findTopByOrderByIdDesc()
                .map(Fish::getId)
                .orElse(PREFIX + String.format("%0" + ID_PADDING + "d", 0));

        try {
            int nextId = Integer.parseInt(lastId.substring(PREFIX.length())) + 1;
            return PREFIX + String.format("%0" + ID_PADDING + "d", nextId);

        } catch (NumberFormatException e) {
            throw new IllegalStateException("Invalid order detail ID format: " + lastId, e);
        }
    }


}
