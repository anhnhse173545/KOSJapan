package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.CreateFishPackDTO;
import com.swp391.koi_ordering_system.dto.response.FishPackDTO;
import com.swp391.koi_ordering_system.model.FishPack;
import com.swp391.koi_ordering_system.model.Variety;
import com.swp391.koi_ordering_system.repository.FishPackRepository;
import com.swp391.koi_ordering_system.repository.VarietyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FishPackService {
    @Autowired
    private FishPackRepository fishPackRepository;

    @Autowired
    private VarietyRepository varietyRepository;

    private static final String PREFIX = "FP";
    private static final int ID_PADDING = 4;

    public List<FishPackDTO> getAllFishPacks() {
        List<FishPack> fishPacks = fishPackRepository.findAll();
        return fishPacks.stream()
                .map((FishPack) -> mapToDTO(FishPack))
                .collect(Collectors.toList());
    }

    public FishPackDTO getFishPackById(String id) {
        FishPack fishPack = fishPackRepository.findById(id).get();
        return mapToDTO(fishPack);
    }

    public FishPack createFishPack(CreateFishPackDTO fishPackDTO) {
            FishPack fishPack = new FishPack();
            Optional<Variety> findVar = varietyRepository.findById(fishPackDTO.getVarietyId());
            if (findVar.isEmpty()) {
                throw new RuntimeException("Variety not found");
            }
            Variety variety = findVar.get();

            fishPack.setId(generateFishPackId());
            fishPack.setLength(fishPackDTO.getLength());
            fishPack.setWeight(fishPackDTO.getWeight());
            fishPack.setDescription(fishPackDTO.getDescription());
            fishPack.setQuantity(fishPackDTO.getQuantity());
            fishPack.setIsDeleted(false);
            fishPack.setVariety(variety);

            return fishPackRepository.save(fishPack);
    }

    public FishPack updateFishPack(String fishPackId, CreateFishPackDTO fishPackDTO){
        Optional<FishPack> fishPack = fishPackRepository.findById(fishPackId);
        if(fishPack.isEmpty()){
            throw new RuntimeException("Fish Pack not found");
        }
        FishPack fishPackToUpdate = fishPack.get();

        fishPackToUpdate.setLength(fishPackDTO.getLength());
        fishPackToUpdate.setWeight(fishPackDTO.getWeight());
        fishPackToUpdate.setDescription(fishPackDTO.getDescription());
        fishPackToUpdate.setQuantity(fishPackDTO.getQuantity());

        return fishPackRepository.save(fishPackToUpdate);
    }

    public void deleteFishPack(String fishPackId) {
        Optional<FishPack> fishPack = fishPackRepository.findById(fishPackId);
        if(fishPack.isEmpty()){
            throw new RuntimeException("Fish Pack not found");
        }
        FishPack fishPackToDelete = fishPack.get();
        fishPackToDelete.setIsDeleted(true);
        fishPackRepository.save(fishPackToDelete);
    }

    public FishPackDTO mapToDTO(FishPack fishPack) {
        FishPackDTO fishPackDTO = new FishPackDTO();

        fishPackDTO.setId(fishPack.getId());
        fishPackDTO.setLength(fishPack.getLength());
        fishPackDTO.setWeight(fishPack.getWeight());
        fishPackDTO.setDescription(fishPack.getDescription());
        fishPackDTO.setQuantity(fishPack.getQuantity());
        fishPackDTO.setVariety(fishPack.getVariety());

        return fishPackDTO;
    }

    public List<FishPackDTO> mapToListDTO(List<FishPack> fishPackList){
        List<FishPackDTO> fishPackDTOList = new ArrayList<>();
        for(FishPack fishPack : fishPackList){
            fishPackDTOList.add(mapToDTO(fishPack));
        }
        return fishPackDTOList;
    }

//    public List<FishDTO> mapToListDTO(List<Fish> fishList) {
//        List<FishDTO> fishDTOList = new ArrayList<>();
//
//        if(fishList == null){
//            return null;
//        }
//
//        for (Fish fish : fishList) {
//            FishDTO fishDTO = new FishDTO();
//
//            fishDTO.setFish_id(fish.getId());
//            fishDTO.setFish_variety_name(fish.getVariety().getName());
//            fishDTO.setWeight(fish.getWeight());
//            fishDTO.setLength(fish.getLength());
//            fishDTO.setDescription(fish.getDescription());
//
//            fishDTOList.add(fishDTO);
//        }
//        return fishDTOList;
//    }


    public String generateFishPackId() {
        String lastId = fishPackRepository.findTopByOrderByIdDesc()
                .map(FishPack::getId)
                .orElse(PREFIX + String.format("%0" + ID_PADDING + "d", 0));

        try {
            int nextId = Integer.parseInt(lastId.substring(PREFIX.length())) + 1;
            return PREFIX + String.format("%0" + ID_PADDING + "d", nextId);

        } catch (NumberFormatException e) {
            throw new IllegalStateException("Invalid fish pack ID format: " + lastId, e);
        }
    }

}
