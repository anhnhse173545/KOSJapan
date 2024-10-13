package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.response.VarietyDTO;
import com.swp391.koi_ordering_system.mapper.VarietyMapper;
import com.swp391.koi_ordering_system.model.Variety;
import com.swp391.koi_ordering_system.repository.VarietyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VarietyService {
    @Autowired
    private VarietyRepository varietyRepository;

    @Autowired
    private VarietyMapper varietyMapper;

    public VarietyDTO createVariety(VarietyDTO varietyDTO) {
        Variety variety = varietyMapper.toEntity(varietyDTO);
        variety.setId(generateVarietyId());
        return varietyMapper.toDTO(varietyRepository.save(variety));
    }

    public List<VarietyDTO> getAllVarieties() {
        return varietyRepository.findAllByIsDeletedFalse().stream()
                .map(varietyMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<VarietyDTO> getVarietyById(String id) {
        return varietyRepository.findByIdAndIsDeletedFalse(id)
                .map(varietyMapper::toDTO);
    }

    public VarietyDTO updateVariety(String id, VarietyDTO varietyDTO) {
        Variety variety = varietyRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Variety not found"));
        variety.setName(varietyDTO.getName());
        variety.setDescription(varietyDTO.getDescription());
        return varietyMapper.toDTO(varietyRepository.save(variety));
    }

    public void deleteVariety(String id) {
        Variety variety = varietyRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Variety not found"));
        variety.setIsDeleted(true);
        varietyRepository.save(variety);
    }

    private String generateVarietyId() {
        String lastVarietyId = varietyRepository.findTopByOrderByIdDesc()
                .map(Variety::getId)
                .orElse("VA0000");
        int nextId = Integer.parseInt(lastVarietyId.substring(2)) + 1;
        return String.format("VA%04d", nextId);
    }

    public VarietyDTO mapToDTO(Variety variety) {
        VarietyDTO varietyDTO = new VarietyDTO();
        varietyDTO.setId(variety.getId());
        varietyDTO.setName(variety.getName());
        varietyDTO.setDescription(variety.getDescription());
        return varietyDTO;
    }

}