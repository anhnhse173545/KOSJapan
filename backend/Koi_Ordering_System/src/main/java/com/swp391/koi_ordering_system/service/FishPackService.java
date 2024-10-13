package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.CreateFishDTO;
import com.swp391.koi_ordering_system.dto.request.CreateFishPackDTO;
import com.swp391.koi_ordering_system.dto.response.FishDTO;
import com.swp391.koi_ordering_system.dto.response.FishPackDTO;
import com.swp391.koi_ordering_system.model.Fish;
import com.swp391.koi_ordering_system.model.FishPack;
import com.swp391.koi_ordering_system.repository.FishPackRepository;
import com.swp391.koi_ordering_system.repository.FishRepository;
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
    private FishRepository fishRepository;

    @Autowired
    private FishService fishService;

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

            fishPack.setId(generateFishPackId());
            fishPack.setLength(fishPackDTO.getLength());
            fishPack.setWeight(fishPackDTO.getWeight());
            fishPack.setDescription(fishPackDTO.getDescription());
            fishPack.setQuantity(fishPack.getListFish().size());

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
        fishPackToUpdate.setQuantity(fishPackToUpdate.getListFish().size());

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

    public FishPack addFishToFishPack(String fishId, String fishPackId) {
        Optional<Fish> fish = fishRepository.findById(fishId);
        Optional<FishPack> fishPack = fishPackRepository.findById(fishPackId);

        if (fishPack.isEmpty()) {
            throw new RuntimeException("Fish Pack not found");
        }
        else if (fish.isEmpty()) {
            throw new RuntimeException("Fish not found");
        }
        Fish foundFish = fish.get();
        FishPack fishPackFound = fishPack.get();

        foundFish.setFishPack(fishPackFound);
        fishRepository.save(foundFish);

        fishPackFound.getListFish().add(foundFish);
        fishPackFound.setQuantity(fishPackFound.getListFish().size());

        return fishPackRepository.save(fishPackFound);
    }

    public FishPack updateFishInFishPack(String fishId, String fishPackId,
                                         CreateFishPackDTO updateKoiPackDTO,
                                         CreateFishDTO fishDTO) {
        Optional<FishPack> fishPack = fishPackRepository.findById(fishPackId);
        Optional<Fish> fish = fishRepository.findById(fishId);
        if(fishPack.isEmpty()){
            throw new RuntimeException("Fish Pack not found");
        }
        else if(fish.isEmpty()){
            throw new RuntimeException("Fish not found");
        }
        FishPack fishPackToUpdate = fishPack.get();
        Fish foundFish = fish.get();

        fishPackToUpdate.setLength(updateKoiPackDTO.getLength());
        fishPackToUpdate.setWeight(updateKoiPackDTO.getWeight());
        fishPackToUpdate.setDescription(updateKoiPackDTO.getDescription());

        if( !fishPackToUpdate.getListFish().contains(foundFish)){
            throw new RuntimeException("Fish in Pack not found, Please add fish !");
        }

        int index = fishPackToUpdate.getListFish().indexOf(foundFish);
        foundFish = fishService.updateFish(fishId, fishDTO);
        fishPackToUpdate.getListFish().set(index, foundFish);

        return fishPackRepository.save(fishPackToUpdate);
    }

    public FishPack removeFishFromFishPack(String fishId, String fishPackId) {
        Optional<FishPack> fishPack = fishPackRepository.findById(fishPackId);
        Optional<Fish> fish = fishRepository.findById(fishId);
        if(fishPack.isEmpty()){
            throw new RuntimeException("Fish Pack not found");
        }
        else if(fish.isEmpty()){
            throw new RuntimeException("Fish not found");
        }
        FishPack sameFishPack = fishPack.get();
        Fish fishFound = fish.get();
        if( !sameFishPack.getListFish().contains(fishFound)){
            throw new RuntimeException("Fish in Pack not found , Remove failed !");
        }
        sameFishPack.getListFish().remove(fishFound);

        fishFound.setFishPack(null);
        fishRepository.save(fishFound);

        return fishPackRepository.save(sameFishPack);
    }

    public FishPackDTO mapToDTO(FishPack fishPack) {
        FishPackDTO fishPackDTO = new FishPackDTO();
        fishPackDTO.setId(fishPack.getId());
        fishPackDTO.setLength(fishPack.getLength());
        fishPackDTO.setWeight(fishPack.getWeight());
        fishPackDTO.setDescription(fishPack.getDescription());
        fishPackDTO.setListFish(mapToListDTO(fishPack.getListFish()));
        return fishPackDTO;
    }

    public List<FishDTO> mapToListDTO(List<Fish> fishList) {
        List<FishDTO> fishDTOList = new ArrayList<>();
        for (Fish fish : fishList) {
            FishDTO fishDTO = new FishDTO();

            fishDTO.setFish_id(fish.getId());
            fishDTO.setFish_variety_name(fish.getVariety().getName());
            fishDTO.setWeight(fish.getWeight());
            fishDTO.setLength(fish.getLength());
            fishDTO.setDescription(fish.getDescription());

            fishDTOList.add(fishDTO);
        }
        return fishDTOList;
    }


    private String generateFishPackId() {
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
