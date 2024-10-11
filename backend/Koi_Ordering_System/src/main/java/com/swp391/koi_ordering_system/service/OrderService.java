package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.CreateFishOrderDTO;
import com.swp391.koi_ordering_system.dto.response.BookingDTO;
import com.swp391.koi_ordering_system.dto.response.FishOrderDTO;
import com.swp391.koi_ordering_system.dto.response.FishPackOrderDetailDTO;
import com.swp391.koi_ordering_system.mapper.FishOrderMapper;
import com.swp391.koi_ordering_system.mapper.FishPackMapper;
import com.swp391.koi_ordering_system.mapper.FishPackOrderDetailMapper;
import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.FishOrder;
import com.swp391.koi_ordering_system.model.FishPack;
import com.swp391.koi_ordering_system.model.FishPackOrderDetail;
import com.swp391.koi_ordering_system.repository.BookingRepository;
import com.swp391.koi_ordering_system.repository.FishPackOrderDetailRepository;
import com.swp391.koi_ordering_system.repository.FishPackRepository;
import com.swp391.koi_ordering_system.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private FishPackOrderDetailRepository fishPackOrderDetailRepository;

    @Autowired
    private FishPackRepository fishPackRepository;

    @Autowired
    private FishOrderMapper fishOrderMapper;

    @Autowired
    private FishPackOrderDetailMapper fishPackOrderDetailMapper;

    @Autowired
    private FishPackMapper fishPackMapper;

    @Autowired
    private BookingRepository bookingRepository;

//    @Transactional
//    public FishOrderDTO createFishOrder(CreateFishOrderDTO createFishOrderDTO) {
//        FishOrder fishOrder = fishOrderMapper.toEntity(createFishOrderDTO);
//        fishOrder.setId(generateFishOrderId());
//
//        fishOrder = orderRepository.save(fishOrder);
//
//        for (FishPackOrderDetailDTO detailDTO : createFishOrderDTO.getFishPackOrderDetails()) {
//
//            FishPackOrderDetail detail = fishPackOrderDetailMapper.toEntity(detailDTO);
//            detail.setId(generateFishPackOrderDetailId());
//
//            detail.setFishOrder(fishOrder);
//
//            FishPack fishPacks = fishPackMapper.toEntity(detailDTO.getFishPack());
//            fishPacks.setId(generateFishPackId());
//            fishPackRepository.save(fishPacks);
//
//            detail.setFishPack(fishPacks);
//            fishPackOrderDetailRepository.save(detail);
//        }
//
//        fishOrder = orderRepository.findById(fishOrder.getId()).orElseThrow(() -> new RuntimeException("FishOrder not found"));
//        return fishOrderMapper.toDTO(fishOrder);
//    }

    public List<FishOrderDTO> getAllOrder() {
        return orderRepository.findAll().stream()
                .map(fishOrderMapper::toDTO)
                .collect(Collectors.toList());
    }

    private String generateFishPackId() {
        String lastFishPackId = fishPackRepository.findTopByOrderByIdDesc()
                .map(FishPack::getId)
                .orElse("FP0000");
        int nextId = Integer.parseInt(lastFishPackId.substring(2)) + 1;
        return String.format("FP%04d", nextId);
    }

    private String generateFishPackOrderDetailId() {
        String lastFishPackOrderDetailId = fishPackOrderDetailRepository.findTopByOrderByIdDesc()
                .map(FishPackOrderDetail::getId)
                .orElse("FPOD0000");
        int nextId = Integer.parseInt(lastFishPackOrderDetailId.substring(4)) + 1;
        return String.format("FPOD%04d", nextId);
    }

    private String generateFishOrderId() {
        String lastFishOrderId = orderRepository.findTopByOrderByIdDesc()
                .map(FishOrder::getId)
                .orElse("PO0000");
        int nextId = Integer.parseInt(lastFishOrderId.substring(2)) + 1;
        return String.format("PO%04d", nextId);
    }
}