package com.swp391.koi_ordering_system.service;


import com.swp391.koi_ordering_system.dto.request.CreateFishPackDTO;
import com.swp391.koi_ordering_system.dto.response.FishPackDTO;
import com.swp391.koi_ordering_system.dto.response.FishPackOrderDetailDTO;
import com.swp391.koi_ordering_system.model.FishOrder;
import com.swp391.koi_ordering_system.model.FishOrderDetail;
import com.swp391.koi_ordering_system.model.FishPack;
import com.swp391.koi_ordering_system.model.FishPackOrderDetail;
import com.swp391.koi_ordering_system.repository.FishPackOrderDetailRepository;
import com.swp391.koi_ordering_system.repository.FishPackRepository;
import com.swp391.koi_ordering_system.repository.OrderRepository;
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

    public FishPackOrderDetail findFishPackOrderDetailByOrderId(String orderId) {
        Optional<FishPackOrderDetail> foundFishPackOrderDetail = fishPackOrderDetailRepository.findByFishOrderId(orderId);
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

    public FishPackOrderDetail createFishPackOrderDetail(String orderId,
                                                         FishPackOrderDetailDTO fishPackOrderDetailDTO) {
        if (orderRepository.findById(orderId).isEmpty()) {
            throw new EntityNotFoundException("Order Id Not Found");
        }

        if (fishPackOrderDetailRepository.findByFishOrderId(orderId).isPresent()) {
            throw new RuntimeException("Fish Pack Order Detail Existed!");
        }

        FishOrder fishOrder = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order Id Not Found"));
        FishPackOrderDetail fishPackOrderDetail = new FishPackOrderDetail();

        fishPackOrderDetail.setId(generateFishPackOrderDetailId());
        fishPackOrderDetail.setPrice(fishPackOrderDetailDTO.getPrice());
        fishPackOrderDetail.setFishOrder(fishOrder);
        fishPackOrderDetail.setFishPack(null);

        return fishPackOrderDetailRepository.save(fishPackOrderDetail);
    }

    public FishPackOrderDetail updateFishPackOrderDetail(String orderId,
                                                     FishPackOrderDetailDTO updatedFPOD){
        Optional<FishPackOrderDetail> foundFPOD = fishPackOrderDetailRepository.findByFishOrderId(orderId);
        if(foundFPOD.isEmpty()){
            throw new RuntimeException("Fish Order Not Found");
        }
        FishPackOrderDetail fishPackOrderDetail = foundFPOD.get();
        FishPack foundFishPack = FishPackRepository.findById(updatedFPOD.getFishPack().getId()).get();

        fishPackOrderDetail.setPrice(updatedFPOD.getPrice());
        fishPackOrderDetail.setFishPack(foundFishPack);

        return fishPackOrderDetailRepository.save(fishPackOrderDetail);
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

    public FishPackOrderDetail addPackToOrderDetail(String fishOrderDetailId, String packId){
        Optional<FishPackOrderDetail> foundFPOD = fishPackOrderDetailRepository.findById(fishOrderDetailId);
        Optional<FishPack> foundFP = FishPackRepository.findById(packId);

        if(foundFPOD.isEmpty()){
            throw new RuntimeException("Fish Order Not Found");
        }
        else if(foundFP.isEmpty()){
            throw new RuntimeException("Fish Pack Not Found, please create a new Fish Pack !");
        }
        FishPackOrderDetail fishPackOrderDetail = foundFPOD.get();
        FishPack fishPack = foundFP.get();

        fishPackOrderDetail.setFishPack(fishPack);

        return fishPackOrderDetailRepository.save(fishPackOrderDetail);

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
        FishPack fishPack = foundFP.get();

        fishPack = fishPackService.updateFishPack(fishPack.getId(), fishPackDTO);

        fishPackOrderDetail.setFishPack(fishPack);

        return fishPackOrderDetailRepository.save(fishPackOrderDetail);
    }

    public FishPackOrderDetail removeFishPackFromOrderDetail(String fishOrderDetailId) {
        Optional<FishPackOrderDetail> foundFPOD = fishPackOrderDetailRepository.findById(fishOrderDetailId);
        if(foundFPOD.isEmpty()){
            throw new RuntimeException("Fish Order Not Found");
        }
        FishPackOrderDetail fishPackOrderDetail = foundFPOD.get();
        fishPackOrderDetail.setFishPack(null);
        return fishPackOrderDetailRepository.save(fishPackOrderDetail);
    }

    public FishPackOrderDetailDTO mapToDTO(FishPackOrderDetail fishPackOrderDetail) {
        FishPackOrderDetailDTO fishPackOrderDetailDTO = new FishPackOrderDetailDTO();

        fishPackOrderDetailDTO.setId(fishPackOrderDetail.getId());
        fishPackOrderDetailDTO.setPrice(fishPackOrderDetail.getPrice());
        fishPackOrderDetailDTO.setFishPack(fishPackService.mapToDTO(fishPackOrderDetail.getFishPack()));

        return fishPackOrderDetailDTO;
    }

    public List<FishPackOrderDetailDTO> mapToListDTO(List<FishPackOrderDetail> fishPackOrderDetails) {
        List<FishPackOrderDetailDTO> fishPackOrderDetailDTOList = new ArrayList<>();
        for (FishPackOrderDetail fishPackOrderDetail : fishPackOrderDetails) {
            FishPackOrderDetailDTO dto = new FishPackOrderDetailDTO();

            dto.setId(fishPackOrderDetail.getId());
            dto.setPrice(fishPackOrderDetail.getPrice());
            dto.setFishPack(fishPackService.mapToDTO(fishPackOrderDetail.getFishPack()));

            fishPackOrderDetailDTOList.add(dto);
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
