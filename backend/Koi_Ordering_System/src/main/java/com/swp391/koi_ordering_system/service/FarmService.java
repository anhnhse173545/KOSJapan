package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.UpdateFarmDTO;
import com.swp391.koi_ordering_system.dto.response.FarmDTO;
import com.swp391.koi_ordering_system.mapper.FarmMapper;
import com.swp391.koi_ordering_system.mapper.VarietyMapper;
import com.swp391.koi_ordering_system.model.Farm;
import com.swp391.koi_ordering_system.model.Variety;
import com.swp391.koi_ordering_system.repository.FarmRepository;
import com.swp391.koi_ordering_system.repository.VarietyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FarmService {
    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private VarietyRepository varietyRepository;

    @Autowired
    private FarmMapper farmMapper;

    @Autowired
    private VarietyMapper varietyMapper;

    public Farm createFarm(Farm farm) {
        farm.setId(generateFarmId());
        return farmRepository.save(farm);
    }

    public List<FarmDTO> getAllFarm() {
        return farmRepository.findAllByIsDeletedFalse().stream()
                .map(farmMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<FarmDTO> getFarmById(String id) {
        return farmRepository.findByIdAndIsDeletedFalse(id)
                .map(farmMapper::toDTO);
    }

    public FarmDTO updateFarm(String farmId, UpdateFarmDTO updateFarmDTO) {
        Farm farm = farmRepository.findByIdAndIsDeletedFalse(farmId)
                .orElseThrow(() -> new RuntimeException("Farm not found"));
        farmMapper.updateEntityFromDTO(updateFarmDTO, farm);
        Farm updatedFarm = farmRepository.save(farm);
        return farmMapper.toDTO(updatedFarm);
    }

    public Farm deleteFarm(String id) {
        Optional<Farm> optionalFarm = farmRepository.findById(id);
        if (optionalFarm.isPresent()) {
            Farm farm = optionalFarm.get();
            farm.setIsDeleted(true);
            return farmRepository.save(farm);
        }
        return null;
    }

    public Farm addVarietyToFarm(String farmId, String varietyId) {
        Optional<Farm> optionalFarm = farmRepository.findByIdAndIsDeletedFalse(farmId);
        Optional<Variety> optionalVariety = varietyRepository.findById(varietyId);

        if (optionalFarm.isPresent() && optionalVariety.isPresent()) {
            Farm farm = optionalFarm.get();
            Variety variety = optionalVariety.get();
            farm.getVarieties().add(variety);
            return farmRepository.save(farm);
        }
        return null;
    }

    private String generateFarmId() {
        String lastBookingId = farmRepository.findTopByOrderByIdDesc()
                .map(Farm::getId)
                .orElse("FA0000");
        int nextId = Integer.parseInt(lastBookingId.substring(2)) + 1;
        return String.format("FA%04d", nextId);
    }




}
