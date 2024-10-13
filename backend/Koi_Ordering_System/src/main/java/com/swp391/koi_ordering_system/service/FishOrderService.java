package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.CreateOrderDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateFishOrderDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateOrderDTO;
import com.swp391.koi_ordering_system.dto.response.FishOrderDTO;
import com.swp391.koi_ordering_system.dto.response.OrderDTO;
import com.swp391.koi_ordering_system.model.FishOrder;
import com.swp391.koi_ordering_system.model.FishOrderDetail;
import com.swp391.koi_ordering_system.model.FishPackOrderDetail;
import com.swp391.koi_ordering_system.repository.FishOrderDetailRepository;
import com.swp391.koi_ordering_system.repository.FishPackOrderDetailRepository;
import com.swp391.koi_ordering_system.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FishOrderService {
    @Autowired
    private FishPackOrderDetailRepository FPODRepository;

    @Autowired
    private FishOrderDetailRepository FODRepository;

    @Autowired
    private OrderRepository OrderRepository;

    @Autowired
    private FishOrderDetailService FODService;

    @Autowired
    private FishPackOrderDetailService FPODService;

    private static final String PREFIX = "PO";
    private static final int ID_PADDING = 4;

    public List<FishOrderDTO> getAllFishOrder() {
        List<FishOrder> list = OrderRepository.findAll();
        return list.stream()
                .map((FishOrder) -> mapToDTO2(FishOrder))
                .collect(Collectors.toList());
    }

    public List<FishOrderDTO> getAllByBookingId(String bookingId) {
        List<FishOrder> list = OrderRepository.findAllByBookingId(bookingId);
        return list.stream()
                .map((FishOrder) -> mapToDTO2(FishOrder))
                .collect(Collectors.toList());
    }

    public List<FishOrderDTO> getFishOrderByBookingIdAndFarmId(String bookingId, String farmId) {
        List<FishOrder> list =OrderRepository.findByBookingIdAndFarmId(bookingId, farmId);
        return list.stream()
                .map((FishOrder) -> mapToDTO2(FishOrder))
                .collect(Collectors.toList());
    }

    public FishOrder createFishOrder(String bookingId, CreateOrderDTO fishOrderDTO) {
        Optional<FishOrder> findOrder = OrderRepository.findFishOrderByBookingId(bookingId);
        Optional<FishOrderDetail> findFOD = FODRepository.findById(fishOrderDTO.getFish_order_detail_id());
        Optional<FishPackOrderDetail> findFPOD = FPODRepository.findById(fishOrderDTO.getFish_pack_order_detail_id());

        if (findOrder.isEmpty()) {
            throw new RuntimeException("Fish order not found");
        }
        FishOrder newOrder = findOrder.get();
        if( !newOrder.getId().isEmpty()){
            throw new RuntimeException("Fish order already exists");
        }
        FishOrderDetail FOD = findFOD.get();
        FishPackOrderDetail FPOD = findFPOD.get();

        newOrder.setId(generateOrderId());
        newOrder.getFishOrderDetails().add(FOD);
        newOrder.getFishPackOrderDetails().add(FPOD);

        FOD.setFishOrder(newOrder);
        FODRepository.save(FOD);

        FPOD.setFishOrder(newOrder);
        FPODRepository.save(FPOD);

        return OrderRepository.save(newOrder);
    }

    public FishOrder updateFishOrder(String bookingId, String farmId, UpdateFishOrderDTO dto) {
        Optional<FishOrder> findOrder = OrderRepository.findFishOrderByBookingIdAndFarmId(bookingId, farmId);
        if (findOrder.isEmpty()) {
            throw new RuntimeException("Fish order not found");
        }
        FishOrder updateOrder = findOrder.get();

        updateOrder.setTotal(dto.getTotal());
        updateOrder.setStatus(dto.getStatus());
        updateOrder.setDeliveryAddress(dto.getDelivery_address());
        updateOrder.setArrivedDate(dto.getArrived_date());

        return OrderRepository.save(updateOrder);
    }

    public void deleteFishOrder(String bookingId, String farmId) {
        Optional<FishOrder> findOrder = OrderRepository.findFishOrderByBookingIdAndFarmId(bookingId, farmId);
        if (findOrder.isEmpty()) {
            throw new RuntimeException("Fish order not found");
        }
        FishOrder deleteOrder = findOrder.get();

        deleteOrder.setIsDeleted(true);
        deleteOrder.setStatus(null);

        OrderRepository.save(deleteOrder);
    }

    public FishOrder addFishPackOrFishOrderDetailToOrder(String bookingId, String farmId, CreateOrderDTO dto){
        Optional<FishOrder> findOrder = OrderRepository.findFishOrderByBookingIdAndFarmId(bookingId, farmId);
        Optional<FishOrderDetail> findFOD = FODRepository.findById(dto.getFish_order_detail_id());
        Optional<FishPackOrderDetail> findFPOD = FPODRepository.findById(dto.getFish_pack_order_detail_id());

        if (findOrder.isEmpty()) {
            throw new RuntimeException("Fish order not found");
        }
        else if (findFOD.isEmpty() && findFPOD.isEmpty()) {
            throw new RuntimeException("Add at least one Fish Pack or Fish Order Detail !");
        }

        FishOrder foundOrder = findOrder.get();
        FishOrderDetail foundFOD = findFOD.get();
        FishPackOrderDetail foundFPOD = findFPOD.get();

        foundOrder.getFishOrderDetails().add(foundFOD);
        foundOrder.getFishPackOrderDetails().add(foundFPOD);

        foundFOD.setFishOrder(foundOrder);
        foundFPOD.setFishOrder(foundOrder);

        FODRepository.save(foundFOD);
        FPODRepository.save(foundFPOD);

        return OrderRepository.save(foundOrder);
    }

    public FishOrder updateOrder(String bookingId, String farmId, UpdateOrderDTO dto) {
        Optional<FishOrder> findOrder = OrderRepository.findFishOrderByBookingIdAndFarmId(bookingId, farmId);

        if (findOrder.isEmpty()) {
            throw new RuntimeException("Fish order not found");
        }
        FishOrder foundOrder = findOrder.get();
        Optional<FishOrderDetail> findFOD = FODRepository.findFishOrderDetailByFishOrderId(foundOrder.getId());
        Optional<FishPackOrderDetail> findFPOD = FPODRepository.findByFishOrderId(foundOrder.getId());
        if (findFOD.isEmpty() && findFPOD.isEmpty()) {
            throw new RuntimeException("There is no Fish Pack or Fish Order Detail !");
        }
        FishPackOrderDetail foundFPOD = findFPOD.get();
        FishOrderDetail foundFOD = findFOD.get();

        FishOrderDetail updateFOD = FODService.updateFishInOrderDetail(dto.getUpdateFOD());
        FishPackOrderDetail updateFPOD = FPODService.updatePackInOrderDetail(
                foundFPOD.getId(),
                foundFPOD.getFishPack().getId(),
                dto.getUpdateFPOD());

        int indexFOD = foundOrder.getFishOrderDetails().indexOf(foundFOD);
        int indexFPOD = foundOrder.getFishPackOrderDetails().indexOf(foundFPOD);

        foundOrder.getFishOrderDetails().set(indexFOD, updateFOD);
        foundOrder.getFishPackOrderDetails().set(indexFPOD, updateFPOD);

        updateFPOD.setFishOrder(foundOrder);
        updateFPOD.setFishOrder(foundOrder);

        FODRepository.save(foundFOD);
        FPODRepository.save(foundFPOD);

        return OrderRepository.save(foundOrder);
    }

    public FishOrder removeFishOrFishPackDetailInOrder(String bookingId, String farmId) {
        Optional<FishOrder> findOrder = OrderRepository.findFishOrderByBookingIdAndFarmId(bookingId, farmId);
        if (findOrder.isEmpty()) {
            throw new RuntimeException("Fish order not found");
        }
        FishOrder removeOrder = findOrder.get();
        Optional<FishOrderDetail> findFOD = FODRepository.findFishOrderDetailByFishOrderId(removeOrder.getId());
        Optional<FishPackOrderDetail> findFPOD = FPODRepository.findByFishOrderId(removeOrder.getId());
        if (findFOD.isEmpty() && findFPOD.isEmpty()) {
            throw new RuntimeException("There is no Fish Pack or Fish Order Detail in this Order !");
        }

        FishOrderDetail foundFOD = findFOD.get();
        FishPackOrderDetail foundFPOD = findFPOD.get();

        int indexFOD = removeOrder.getFishOrderDetails().indexOf(foundFOD);
        int indexFPOD = removeOrder.getFishPackOrderDetails().indexOf(foundFPOD);

        removeOrder.getFishOrderDetails().remove(indexFOD);
        removeOrder.getFishPackOrderDetails().remove(indexFPOD);

        foundFOD.setFishOrder(removeOrder);
        foundFPOD.setFishOrder(removeOrder);

        FODRepository.save(foundFOD);
        FPODRepository.save(foundFPOD);

        return OrderRepository.save(removeOrder);
    }

    public List<FishOrderDTO> mapToDTO(List<FishOrder> fishOrders) {
        List<FishOrderDTO> dtos = new ArrayList<>();
        for (FishOrder fishOrder : fishOrders) {
            List<FishOrderDetail> findFOD = FODRepository.findByFishOrderId(fishOrder.getId());
            List<FishPackOrderDetail> findFPOD = FPODRepository.findFishPackOrderDetailsByFishOrderId(fishOrder.getId());
            if (findFPOD.isEmpty() && findFOD.isEmpty()) {
                throw new RuntimeException("Fish Order does not have any Fish Pack Order Details or Fish Pack Order Details");
            }
            FishOrderDTO orderDTO = new FishOrderDTO();

            orderDTO.setId(fishOrder.getId());
            orderDTO.setStatus(fishOrder.getStatus());
            orderDTO.setTotal(fishOrder.getTotal());
            orderDTO.setDeliveryAddress(fishOrder.getDeliveryAddress());
            orderDTO.setFishOrderDetails(FODService.mapToListDTO(findFOD));
            orderDTO.setFishPackOrderDetails(FPODService.mapToListDTO(findFPOD));

            dtos.add(orderDTO);
        }
        return dtos;
    }

    public FishOrderDTO mapToDTO2(FishOrder fishOrder){
        FishOrderDTO dto = new FishOrderDTO();
        List<FishOrderDetail> findFOD = FODRepository.findByFishOrderId(fishOrder.getId());
        List<FishPackOrderDetail> findFPOD = FPODRepository.findFishPackOrderDetailsByFishOrderId(fishOrder.getId());
        if (findFOD.isEmpty() && findFPOD.isEmpty()) {
            throw new RuntimeException("Does not have any Fish Pack Order Details or Fish Pack Order Details");
        }

        dto.setId(fishOrder.getId());
        dto.setStatus(fishOrder.getStatus());
        dto.setTotal(fishOrder.getTotal());
        dto.setDeliveryAddress(fishOrder.getDeliveryAddress());
        dto.setFarmId(fishOrder.getFarm().getId());
        dto.setBookingId(fishOrder.getBooking().getId());
        dto.setFishOrderDetails(FODService.mapToListDTO(findFOD));
        dto.setFishPackOrderDetails(FPODService.mapToListDTO(findFPOD));

        return dto;
    }

    private String generateOrderId() {
        String lastId = OrderRepository.findTopByOrderByIdDesc()
                .map(FishOrder::getId)
                .orElse(PREFIX + String.format("%0" + ID_PADDING + "d", 0));

        try {
            int nextId = Integer.parseInt(lastId.substring(PREFIX.length())) + 1;
            return PREFIX + String.format("%0" + ID_PADDING + "d", nextId);

        } catch (NumberFormatException e) {
            throw new IllegalStateException("Invalid order detail ID format: " + lastId, e);
        }
    }


}