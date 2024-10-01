package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.model.Farm;
import com.swp391.koi_ordering_system.repository.FarmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FarmService {
    @Autowired
    private FarmRepository farmRepository;

    public Farm createFarm(Farm farm) {
        return farmRepository.save(farm);
    }

    public List<Farm> getAllFarm() {
        return farmRepository.findAllByIsDeletedFalse();
    }

    public Optional<Farm> getFarmById(String id) {
        return farmRepository.findByIdAndIsDeletedFalse(id);
    }

    public Farm updateFarm(String id, Farm farmDetails) {
        Optional<Farm> optionalFarm = farmRepository.findById(id);
        if (optionalFarm.isPresent()) {
            Farm farm = optionalFarm.get();
            if (farmDetails.getAddress() != null) {
                farm.setAddress(farmDetails.getAddress());
            }
            if (farmDetails.getPhoneNumber() != null) {
                farm.setPhoneNumber(farmDetails.getPhoneNumber());
            }
            if (farmDetails.getName() != null) {
                farm.setName(farmDetails.getName());
            }
            if (farmDetails.getPhone() != null) {
                farm.setPhone(farmDetails.getPhone());
            }
            if (farmDetails.getIsDeleted() != null) {
                farm.setIsDeleted(farmDetails.getIsDeleted());
            }
            return farmRepository.save(farm);
        }
        return null;
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
}
