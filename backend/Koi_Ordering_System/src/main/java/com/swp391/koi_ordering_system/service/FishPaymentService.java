package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.response.FishPaymentDTO;
import com.swp391.koi_ordering_system.model.FishOrder;
import com.swp391.koi_ordering_system.model.FishPayment;
import com.swp391.koi_ordering_system.repository.FishPaymentRepository;
import com.swp391.koi_ordering_system.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;

@Service
public class FishPaymentService {
    @Autowired
    private FishPaymentRepository fishPaymentRepository;

    @Autowired
    private OrderRepository orderRepository;


    private static final String PREFIX = "FP";
    private static final int ID_PADDING = 4;

    public FishPayment createFishPaymentUsingPayPal(String orderId) {
        Optional<FishOrder> findFishOrder = orderRepository.findById(orderId);
        if(findFishOrder.isEmpty()){
            throw new RuntimeException("Order not found");
        }
        FishOrder fishOrder = findFishOrder.get();
        FishPayment fishPayment = new FishPayment();
        orderRepository.save(fishOrder);

        Instant instant = Instant.now();
        LocalDateTime localDateTime = LocalDateTime.ofInstant(instant, ZoneId.systemDefault());

        fishPayment.setId(generateFishPaymentId());
        fishPayment.setAmount(fishOrder.getTotal());
        fishPayment.setPaymentMethod("PayPal");
        fishPayment.setIsDeleted(false);
        fishPayment.setFishOrder(fishOrder);
        fishPayment.setCreateAt(localDateTime);
        fishPayment.setStatus("Pending");

        fishPaymentRepository.save(fishPayment);
        fishOrder.setFishPayments(fishPayment);
        fishOrder.setPaymentStatus(fishPayment.getStatus());
        orderRepository.save(fishOrder);

        return fishPaymentRepository.save(fishPayment);
    }

    public void updateFishPaymentUsingPayPal(String orderId){
        FishPayment fishPayment = fishPaymentRepository.findFishPaymentByFishOrderId(orderId);
        FishOrder fishOrder = orderRepository.findById(orderId).get();
        if(fishPayment.getStatus().equals("Pending")){
            fishPayment.setStatus("Deposited");
            fishOrder.setStatus("Deposited");
            fishOrder.setPaymentStatus(fishPayment.getStatus());
            orderRepository.save(fishOrder);
        }
        else if(fishPayment.getStatus().equals("Deposited")){
            fishPayment.setStatus("Paid Full");
            fishOrder.setStatus("Completed");
            fishOrder.setPaymentStatus(fishPayment.getStatus());
            orderRepository.save(fishOrder);
        }
        orderRepository.save(fishOrder);
        fishPaymentRepository.save(fishPayment);
    }

    public FishPaymentDTO mapToDTO(FishPayment fishPayment) {
        FishPaymentDTO fishPaymentDTO = new FishPaymentDTO();
        if(fishPayment == null){
            return null;
        }
        fishPaymentDTO.setId(fishPayment.getId());
        fishPaymentDTO.setStatus(fishPayment.getStatus());
        fishPaymentDTO.setPaymentMethod(fishPayment.getPaymentMethod());
        fishPaymentDTO.setAmount(fishPayment.getAmount());
        fishPaymentDTO.setCreated_at(fishPayment.getCreateAt());
        return fishPaymentDTO;
    }

    private String generateFishPaymentId() {
        String lastId = fishPaymentRepository.findTopByOrderByIdDesc()
                .map(FishPayment::getId)
                .orElse(PREFIX + String.format("%0" + ID_PADDING + "d", 0));

        try {
            int nextId = Integer.parseInt(lastId.substring(PREFIX.length())) + 1;
            return PREFIX + String.format("%0" + ID_PADDING + "d", nextId);

        } catch (NumberFormatException e) {
            throw new IllegalStateException("Invalid order detail ID format: " + lastId, e);
        }
    }
}
