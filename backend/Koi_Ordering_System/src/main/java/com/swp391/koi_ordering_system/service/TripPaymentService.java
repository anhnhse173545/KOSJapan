package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.response.TripPaymentDTO;
import com.swp391.koi_ordering_system.mapper.TripPaymentMapper;
import com.swp391.koi_ordering_system.model.TripPayment;
import com.swp391.koi_ordering_system.repository.TripPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TripPaymentService {

    @Autowired
    private TripPaymentRepository tripPaymentRepository;

    @Autowired
    private TripPaymentMapper tripPaymentMapper;

    public TripPayment createTripPayment(TripPayment tripPayment) {
        tripPayment.setId(generateTripPaymentId());
        return tripPaymentRepository.save(tripPayment);
    }

    public List<TripPaymentDTO> getAllTripPayment() {
        return tripPaymentRepository.findAllByIsDeletedFalse().stream()
                .map(tripPaymentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<TripPaymentDTO> getTripPaymentById(String id) {
        return tripPaymentRepository.findByIdAndIsDeletedFalse(id)
                .map(tripPaymentMapper::toDTO);
    }

    public void deleteTripPayment(String id) {
        Optional<TripPayment> optionalTripPayment = tripPaymentRepository.findById(id);
        if (optionalTripPayment.isPresent()) {
            TripPayment tripPayment = optionalTripPayment.get();
            tripPayment.setIsDeleted(true);
            tripPaymentRepository.save(tripPayment);
        }
    }

    public TripPaymentDTO mapToDTO(TripPayment tripPayment) {
        TripPaymentDTO tripPaymentDTO = new TripPaymentDTO();

        tripPaymentDTO.setId(tripPayment.getId());
        tripPaymentDTO.setPaymentMethodName(tripPayment.getPaymentMethod().getName());
        tripPaymentDTO.setAmount(tripPayment.getAmount());

        return tripPaymentDTO;
    }

    private String generateTripPaymentId() {
        String lastTripId = tripPaymentRepository.findTopByOrderByIdDesc()
                .map(TripPayment::getId)
                .orElse("TR0000");
        int nextId = Integer.parseInt(lastTripId.substring(2)) + 1;
        return String.format("TR%04d", nextId);
    }
}
