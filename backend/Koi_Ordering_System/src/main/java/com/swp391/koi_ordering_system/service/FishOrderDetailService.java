package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.CreateFishDTO;
import com.swp391.koi_ordering_system.dto.request.CreateOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateFishInOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.response.FishOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.response.FishPackOrderDetailDTO;
import com.swp391.koi_ordering_system.model.*;
import com.swp391.koi_ordering_system.repository.FishOrderDetailRepository;
import com.swp391.koi_ordering_system.repository.FishRepository;
import com.swp391.koi_ordering_system.repository.OrderRepository;
import com.swp391.koi_ordering_system.repository.VarietyRepository;
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

    @Autowired
    private VarietyRepository varietyRepository;

    @Autowired
    private FishService fishService;

    private static final String PREFIX = "FOD";
    private static final int ID_PADDING = 4;

    public List<FishOrderDetailDTO> findAllByOrderId(String id) {
        List<FishOrderDetail> list = fishOrderDetailRepository.findByFishOrderId(id);
        return list.stream()
                .map((FishOrderDetail) -> mapToDTO(FishOrderDetail))
                .collect(Collectors.toList());
    }

    public FishOrderDetail createFishAndOrderDetail(CreateFishDTO dto) {
        // Create Fish
        Fish newFish = new Fish();
        newFish.setId(fishService.generateFishId());
        Variety variety = varietyRepository.findById(dto.getVariety_id())
                .orElseThrow(() -> new RuntimeException("Variety id not found"));
        newFish.setVariety(variety);
        newFish.setLength(dto.getLength());
        newFish.setWeight(dto.getWeight());
        newFish.setDescription(dto.getDescription());
        fishRepository.save(newFish);

        // Create FishOrderDetail
        FishOrderDetail fishOrderDetail = new FishOrderDetail();
        fishOrderDetail.setId(generateOrderDetailId());
        fishOrderDetail.setPrice(dto.getPrice());
        fishOrderDetail.setIsDeleted(false);
        fishOrderDetail.setFish(newFish);
        fishOrderDetailRepository.save(fishOrderDetail);

        // Associate FishOrderDetail with FishOrder
        Optional<FishOrder> foundFishOrder = orderRepository.findById(dto.getOrderId());

        if(foundFishOrder.isPresent()){
            FishOrder fishOrder = foundFishOrder.get();
            fishOrder.getFishOrderDetails().add(fishOrderDetail);
            fishOrderDetail.setFishOrder(fishOrder);
            fishOrder.setTotal(fishOrder.getTotal() + fishOrderDetail.getPrice());

            fishOrderDetailRepository.save(fishOrderDetail);
            orderRepository.save(fishOrder);
        }

        return fishOrderDetail;
    }

    public void deleteFishOrderDetail(String fishOrderDetailId){
        Optional<FishOrderDetail> fishOrderDetail = fishOrderDetailRepository.findById(fishOrderDetailId);
        if(fishOrderDetail.isEmpty()){
            throw new RuntimeException("Fish Order Detail does not exist");
        }
        FishOrderDetail fishOrderDetail1 = fishOrderDetail.get();

        FishOrder fishOrder = fishOrderDetail1.getFishOrder();
        fishOrder.getFishOrderDetails().remove(fishOrderDetail1);
        fishOrderDetailRepository.delete(fishOrderDetail1);
        orderRepository.save(fishOrder);
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

            FishOrder fishOrder = fishOrderDetail1.getFishOrder();
            int index = fishOrder.getFishOrderDetails().indexOf(fishOrderDetail1);
            fishOrder.getFishOrderDetails().set(index, fishOrderDetail1);

            orderRepository.save(fishOrder);
            fishOrderDetailRepository.save(fishOrderDetail1);
        }
        return null;
    }

    public FishOrderDetailDTO mapToDTO(FishOrderDetail fishOrderDetail) {
        FishOrderDetailDTO fishOrderDetailDTO = new FishOrderDetailDTO();

        if (fishOrderDetail == null) {
            return null;
        }

        fishOrderDetailDTO.setId(fishOrderDetail.getId());
        fishOrderDetailDTO.setFish(fishService.mapToDTO(fishOrderDetail.getFish()));
        fishOrderDetailDTO.setPrice(fishOrderDetail.getPrice());

        return fishOrderDetailDTO;
    }



    public List<FishOrderDetailDTO> mapToListDTO(List<FishOrderDetail> fishOrderDetails) {
        List<FishOrderDetailDTO> fishOrderDetailDTOList = new ArrayList<>();
        if(fishOrderDetails == null){
            return null;
        }
        for (FishOrderDetail fishOrderDetail : fishOrderDetails) {
            FishOrderDetailDTO fishOrderDetailDTO = new FishOrderDetailDTO();

            fishOrderDetailDTO.setId(fishOrderDetail.getId());
            fishOrderDetailDTO.setFish(fishService.mapToDTO(fishOrderDetail.getFish()));
            fishOrderDetailDTO.setPrice(fishOrderDetail.getPrice());

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
