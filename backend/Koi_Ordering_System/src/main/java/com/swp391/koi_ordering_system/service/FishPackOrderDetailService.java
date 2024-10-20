package com.swp391.koi_ordering_system.service;


import com.swp391.koi_ordering_system.dto.request.CreateFishDTO;
import com.swp391.koi_ordering_system.dto.request.CreateFishPackDTO;
import com.swp391.koi_ordering_system.dto.request.CreateOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.response.FishPackDTO;
import com.swp391.koi_ordering_system.dto.response.FishPackOrderDetailDTO;
import com.swp391.koi_ordering_system.model.*;
import com.swp391.koi_ordering_system.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FishPackOrderDetailService {
    @Autowired
    private FishPackOrderDetailRepository fishPackOrderDetailRepository;

    @Autowired
    private FishPackService fishPackService;

    @Autowired
    private FishPackRepository FishPackRepository;

    @Autowired
    private OrderRepository orderRepository;


    private static final String PREFIX = "FPOD";
    private static final int ID_PADDING = 4;

    public List<FishPackOrderDetailDTO> getAllFishPackOrderDetails() {
        List<FishPackOrderDetail> fishPackOrderDetails = fishPackOrderDetailRepository.findAll();
        return fishPackOrderDetails.stream()
                .map((FishPackOrderDetail) -> mapToDTO(FishPackOrderDetail))
                .collect(Collectors.toList());
    }

    public FishPackOrderDetail getFishPackOrderDetailById(String fishPackOrderDetailId) {
        Optional<FishPackOrderDetail> foundFishPackOrderDetail = fishPackOrderDetailRepository.findById(fishPackOrderDetailId);
        if (foundFishPackOrderDetail.isEmpty()) {
            throw new RuntimeException("Fish Pack Order Detail Not Found");
        }
        return foundFishPackOrderDetail.get();
    }

    public List<FishPackOrderDetailDTO> getAllFishPackOrderDetailsByOrderId(String orderId) {
        List<FishPackOrderDetail> list = fishPackOrderDetailRepository.findFishPackOrderDetailsByFishOrderId(orderId);
        if (list.isEmpty()) {
            throw new RuntimeException("Fish Pack Order Detail Not Found");
        }
        return list.stream().
                map((FishPackOrderDetail -> mapToDTO(FishPackOrderDetail)))
                .collect(Collectors.toList());
    }

    public FishPackOrderDetail createFishPackAndFishPackOrderDetail(CreateFishPackDTO dto){
        //create Fish Pack
        FishPack newFishPack = new FishPack();
        newFishPack.setId(fishPackService.generateFishPackId());
        newFishPack = fishPackService.createFishPack(dto);

        //Create Fish Pack Order Detail
        FishPackOrderDetail newFishPackOrderDetail = new FishPackOrderDetail();
        newFishPackOrderDetail.setId(generateFishPackOrderDetailId());
        newFishPackOrderDetail.setFishPack(newFishPack);
        newFishPackOrderDetail.setFishOrder(null);
        newFishPackOrderDetail.setPrice(dto.getPackOrderDetailPrice());
        newFishPackOrderDetail.setIsDeleted(false);

        FishPackRepository.save(newFishPack);

        //Add FPOD into Fish Order
        Optional<FishOrder> foundFishOrder = orderRepository.findById(dto.getOrderId());

        if(foundFishOrder.isPresent()){
            FishOrder fishOrder = foundFishOrder.get();
            fishOrder.getFishPackOrderDetails().add(newFishPackOrderDetail);
            newFishPackOrderDetail.setFishOrder(fishOrder);
            fishOrder.setTotal(fishOrder.getTotal()+newFishPackOrderDetail.getPrice());

            fishPackOrderDetailRepository.save(newFishPackOrderDetail);
            orderRepository.save(fishOrder);
        }

        return fishPackOrderDetailRepository.save(newFishPackOrderDetail);
    }


    public void deleteFishPackOrderDetail(String orderId) {
        Optional<FishPackOrderDetail> foundFPOD = fishPackOrderDetailRepository.findByFishOrderId(orderId);
        if(foundFPOD.isEmpty()){
            throw new RuntimeException("Fish Order Not Found");
        }
        FishPackOrderDetail fishPackOrderDetail = foundFPOD.get();
        fishPackOrderDetail.setIsDeleted(true);

        fishPackOrderDetailRepository.save(fishPackOrderDetail);
    }


    public FishPackOrderDetail updatePackInOrderDetail(String fishPackOrderDetailId, String packId,
                                                       CreateFishPackDTO fishPackDTO){
        Optional<FishPackOrderDetail> foundFPOD = fishPackOrderDetailRepository.findById(fishPackOrderDetailId);
        Optional<FishPack> foundFP = FishPackRepository.findById(packId);

        if(foundFPOD.isEmpty()){
            throw new RuntimeException("Fish Order Not Found");
        }
        else if(foundFP.isEmpty()){
            throw new RuntimeException("Fish Pack Not Found, please create a new Fish Pack !");
        }
        FishPackOrderDetail fishPackOrderDetail = foundFPOD.get();
        FishPack fishPack = foundFP.get(); //old fish pack

        fishPack = fishPackService.updateFishPack(fishPack.getId(), fishPackDTO); //updated fish pack
        fishPackOrderDetail.setFishPack(fishPack);// replace the old

        FishPackRepository.save(fishPack);
        return fishPackOrderDetailRepository.save(fishPackOrderDetail);
    }


    public FishPackOrderDetailDTO mapToDTO(FishPackOrderDetail fishPackOrderDetail) {
        FishPackOrderDetailDTO fishPackOrderDetailDTO = new FishPackOrderDetailDTO();

        if(fishPackOrderDetail == null){
            return null;
        }

        fishPackOrderDetailDTO.setId(fishPackOrderDetail.getId());
        fishPackOrderDetailDTO.setPrice(fishPackOrderDetail.getPrice());
        fishPackOrderDetailDTO.setFishPack(fishPackService.mapToDTO(fishPackOrderDetail.getFishPack()));

        return fishPackOrderDetailDTO;
    }

    public List<FishPackOrderDetailDTO> mapToListDTO(List<FishPackOrderDetail> fishPackOrderDetails) {
        List<FishPackOrderDetailDTO> fishPackOrderDetailDTOList = new ArrayList<>();
        for (FishPackOrderDetail fishPackOrderDetail : fishPackOrderDetails) {
            fishPackOrderDetailDTOList.add(mapToDTO(fishPackOrderDetail));
        }
        return fishPackOrderDetailDTOList;
    }

    private String generateFishPackOrderDetailId() {
        String lastId = fishPackOrderDetailRepository.findTopByOrderByIdDesc()
                .map(FishPackOrderDetail::getId)
                .orElse(PREFIX + String.format("%0" + ID_PADDING + "d", 0));

        try {
            int nextId = Integer.parseInt(lastId.substring(PREFIX.length())) + 1;
            return PREFIX + String.format("%0" + ID_PADDING + "d", nextId);

        } catch (NumberFormatException e) {
            throw new IllegalStateException("Invalid fish pack order detail ID format: " + lastId, e);
        }
    }

}
