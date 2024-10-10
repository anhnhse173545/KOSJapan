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
import java.util.Optional;
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
        Optional<FishOrderDetail> fishOrderDetail = fishOrderDetailRepository.findById(fishOrderDetailId);
        if(fishOrderDetail.isPresent()){
            FishOrderDetail fishOrderDetail1 = fishOrderDetail.get();
            fishOrderDetail1.setIsDeleted(true);
            fishOrderDetailRepository.save(fishOrderDetail1);
        }
        throw new RuntimeException("Fish Order Detail does not exist");
    }

    public FishOrderDetail addFishToOrderDetail(String orderDetailID, String fishId){
        Optional<Fish> findFish= fishRepository.findById(fishId);
        Optional<FishOrderDetail> findOrderDetail = fishOrderDetailRepository.findById(orderDetailID);

        if(findFish.isPresent() && findOrderDetail.isPresent()){
            FishOrderDetail fishOrderDetail = findOrderDetail.get();
            Fish addFish = findFish.get();
            fishOrderDetail.setFish(addFish);
            fishOrderDetailRepository.save(fishOrderDetail);
        }

        return null;
    }

    public FishOrderDetail updateFishInOrderDetail(UpdateFishInOrderDetailDTO fishDTO){
        Optional<FishOrderDetail> foundFishOrderDetail = fishOrderDetailRepository.findById(fishDTO.getOrderDetailId());
        if(foundFishOrderDetail.isPresent()){

            FishOrderDetail fishOrderDetail1 = foundFishOrderDetail.get();
            Optional<Fish> foundFish = fishRepository.findById(fishDTO.getFishId());

            if( foundFish.isEmpty()){
                throw new RuntimeException("Fish does not exist");
            }
            Fish updateFish = foundFish.get();

            fishOrderDetail1.setFish(updateFish);
            fishOrderDetail1.setPrice(fishDTO.getOrderDetailPrice());

            fishOrderDetailRepository.save(fishOrderDetail1);
        }
        return null;
    }

    public FishOrderDetail removeFishFromOrderDetail(String orderDetailId, String fishId){
        Optional<FishOrderDetail> foundFishOrderDetail = fishOrderDetailRepository.findById(orderDetailId);
        if(foundFishOrderDetail.isPresent()){
            FishOrderDetail fishOrderDetail1 = foundFishOrderDetail.get();
            Optional<Fish> foundFish = fishRepository.findById(fishId);
            if(foundFish.isEmpty()){
                throw new RuntimeException("Fish does not exist");
            }
            fishOrderDetail1.getFish().setIsDeleted(true);
        }
        return null;
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
