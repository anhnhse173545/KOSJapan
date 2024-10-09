package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.CreateFishOrderDTO;
import com.swp391.koi_ordering_system.dto.request.CreateOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateFishInOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.response.FishOrderDTO;
import com.swp391.koi_ordering_system.dto.response.FishOrderDetailDTO;
import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.Fish;
import com.swp391.koi_ordering_system.model.FishOrder;
import com.swp391.koi_ordering_system.model.FishOrderDetail;
import com.swp391.koi_ordering_system.repository.FishOrderDetailRepository;
import com.swp391.koi_ordering_system.repository.FishRepository;
import com.swp391.koi_ordering_system.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FishOrderDetailService {
    @Autowired
    private FishOrderDetailRepository fishOrderDetailRepository;

    @Autowired
    private FishRepository fishRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<FishOrderDetailDTO> findAllByOrderId(String id) {
        List<FishOrderDetail> list = fishOrderDetailRepository.findByFishOrderId(id);
        return list.stream()
                .map((FishOrderDetail) -> mapToDTO(FishOrderDetail))
                .collect(Collectors.toList());
    }

    public FishOrderDetail createFishOrderDetail(CreateOrderDetailDTO createFishOrderDTO, String orderDetailId){
        FishOrderDetail fishOrderDetail = fishOrderDetailRepository.findFishOrderDetailById(orderDetailId);
        if(fishOrderDetail != null){
            throw new RuntimeException("Fish Order Detail existed");
        }
        fishOrderDetail = new FishOrderDetail();
        fishOrderDetail.setId(generateOrderDetailId());
        Fish orderFish = fishRepository.findFishById(createFishOrderDTO.getFish_id());
        FishOrder fishOrder = orderRepository.findFishOrderById(createFishOrderDTO.getOrderId());
        if(fishOrder != null && orderFish != null){
            fishOrderDetail.setFishOrder(fishOrder);
            fishOrderDetail.setFish(orderFish);
            fishOrderDetail.setPrice(createFishOrderDTO.getPrice());
            fishOrderDetailRepository.save(fishOrderDetail);
        }
        return fishOrderDetail;
    }

    public void deleteFishOrderDetail(String fishOrderDetailId){
        fishOrderDetailRepository.deleteById(fishOrderDetailId);
    }

    public FishOrderDetail addFishToOrderDetail(String orderDetailID, String fishId){
        FishOrderDetail orderDetail = fishOrderDetailRepository.findFishOrderDetailById(orderDetailID);

        Fish addFish = fishRepository.findFishById(fishId);

        orderDetail.setFish(addFish);

        return fishOrderDetailRepository.save(orderDetail);
    }

    public FishOrderDetail updateFishInOrderDetail(String orderDetailID, UpdateFishInOrderDetailDTO fishDTO){
            FishOrderDetail orderDetail = fishOrderDetailRepository.findFishOrderDetailById(orderDetailID);
            if(orderDetail == null){
                throw new RuntimeException("Fish Order Detail not found");
            }
            Fish updateFish = fishRepository.findFishById(fishDTO.getFishId());
            if(updateFish == null){
                throw new RuntimeException("Fish not found");
            }
            orderDetail.setFish(updateFish);
            orderDetail.setPrice(fishDTO.getOrderDetailPrice());
            return fishOrderDetailRepository.save(orderDetail);
    }

    public FishOrderDetail removeFishFromOrderDetail(String orderDetailId, String fishId){
        FishOrderDetail orderDetail = fishOrderDetailRepository.findFishOrderDetailById(orderDetailId);
        if(orderDetail == null){
            throw new RuntimeException("Fish Order Detail not found");
        }
        Fish removeFish = fishRepository.findFishById(fishId);
        if(removeFish == null){
            throw new RuntimeException("Fish not found");
        }
        fishOrderDetailRepository.deleteFishByFish(removeFish);
        return fishOrderDetailRepository.save(orderDetail);
    }

    public FishOrderDetailDTO mapToDTO(FishOrderDetail fishOrderDetail) {
        FishOrderDetailDTO fishOrderDetailDTO = new FishOrderDetailDTO();

        fishOrderDetailDTO.setId(fishOrderDetail.getId());
        fishOrderDetailDTO.setFish(fishOrderDetail.getFish());
        fishOrderDetailDTO.setFish_price(fishOrderDetail.getPrice());

        return fishOrderDetailDTO;
    }


    private String generateOrderDetailId() {
        String lastId = fishOrderDetailRepository.findTopByOrderByIdDesc()
                .map(FishOrderDetail::getId)
                .orElse("POD0000");
        int nextId = Integer.parseInt(lastId.substring(2)) + 1;
        return String.format("POD%04d", nextId);
    }
}
