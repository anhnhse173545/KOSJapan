package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.CreateOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateFishInOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.response.FishOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.response.FishPackOrderDetailDTO;
import com.swp391.koi_ordering_system.model.Fish;
import com.swp391.koi_ordering_system.model.FishOrder;
import com.swp391.koi_ordering_system.model.FishOrderDetail;
import com.swp391.koi_ordering_system.model.FishPackOrderDetail;
import com.swp391.koi_ordering_system.repository.FishOrderDetailRepository;
import com.swp391.koi_ordering_system.repository.FishRepository;
import com.swp391.koi_ordering_system.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    private static final String PREFIX = "FOD";
    private static final int ID_PADDING = 4;

    public List<FishOrderDetailDTO> findAllByOrderId(String id) {
        List<FishOrderDetail> list = fishOrderDetailRepository.findByFishOrderId(id);
        return list.stream()
                .map((FishOrderDetail) -> mapToDTO(FishOrderDetail))
                .collect(Collectors.toList());
    }

    public FishOrderDetail createFishOrderDetail(CreateOrderDetailDTO createFishOrderDTO){

        FishOrderDetail fishOrderDetail = new FishOrderDetail();
        fishOrderDetail.setId(generateOrderDetailId());

        Optional<Fish> foundFish = fishRepository.findById(createFishOrderDTO.getFish_id());
        if(foundFish.isEmpty()){
            throw new RuntimeException("Fish does not exists");
        }
        Fish addfish = foundFish.get();
        fishOrderDetail.setFish(addfish);

        Optional<FishOrder> foundFishOrder = orderRepository.findById(createFishOrderDTO.getOrderId());
        if(foundFishOrder.isPresent()){
            FishOrder fishOrder = foundFishOrder.get();
            fishOrder.getFishOrderDetails().add(fishOrderDetail);
            fishOrderDetail.setFishOrder(fishOrder);
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



    public List<FishOrderDetailDTO> mapToListDTO(List<FishOrderDetail> fishOrderDetails) {
        List<FishOrderDetailDTO> fishOrderDetailDTOList = new ArrayList<>();
        for (FishOrderDetail fishOrderDetail : fishOrderDetails) {
            FishOrderDetailDTO fishOrderDetailDTO = new FishOrderDetailDTO();

            fishOrderDetailDTO.setId(fishOrderDetail.getId());
            fishOrderDetailDTO.setFish(fishOrderDetail.getFish());
            fishOrderDetailDTO.setFish_price(fishOrderDetail.getPrice());

            fishOrderDetailDTOList.add(fishOrderDetailDTO);
        }
        return fishOrderDetailDTOList;
    }

    private String generateOrderDetailId() {
        String lastId = fishOrderDetailRepository.findTopByOrderByIdDesc()
                .map(FishOrderDetail::getId)
                .orElse(PREFIX + String.format("%0" + ID_PADDING + "d", 0));

        try {
            int nextId = Integer.parseInt(lastId.substring(PREFIX.length())) + 1;
            return PREFIX + String.format("%0" + ID_PADDING + "d", nextId);

        } catch (NumberFormatException e) {
            throw new IllegalStateException("Invalid order detail ID format: " + lastId, e);
        }
    }
}
