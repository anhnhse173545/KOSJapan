package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.*;
import com.swp391.koi_ordering_system.dto.response.DeliveryStaffOrderDTO;
import com.swp391.koi_ordering_system.dto.response.FishOrderDTO;
import com.swp391.koi_ordering_system.dto.response.FishPackOrderDetailDTO;
import com.swp391.koi_ordering_system.dto.response.OrderDTO;
import com.swp391.koi_ordering_system.mapper.FishOrderMapper;
import com.swp391.koi_ordering_system.model.*;
import com.swp391.koi_ordering_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
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

    @Autowired
    private FishOrderMapper fishOrderMapper;

    @Autowired
    private FarmRepository FarmRepository;

    @Autowired
    private BookingRepository BookingRepository;

    private static final String PREFIX = "PO";
    private static final int ID_PADDING = 4;
    @Autowired
    private OrderRepository orderRepository;

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

    public FishOrder createFishOrder(String bookingId, String farmId, CreateOrderDTO dto) {
            Optional<FishOrder> fishOrder = orderRepository.findFishOrderByBookingIdAndFarmId(bookingId, farmId);
            Optional<Farm> findFarm = FarmRepository.findById(farmId);
            Optional<Booking> findBooking = BookingRepository.findById(bookingId);
        if (findBooking.isEmpty() && findFarm.isEmpty()) {
            throw new RuntimeException("Farm and Booking not found");
        }
        if (fishOrder.isPresent()) {
            throw new RuntimeException("Fish order already exists");
        }
        Farm farm = findFarm.get();
        Booking booking = findBooking.get();
        FishOrder newFishOrder = new FishOrder();

        newFishOrder.setId(generateOrderId());
        newFishOrder.setStatus("Pending");
        newFishOrder.setCreateAt(dto.getCreateAt());
        newFishOrder.setArrivedDate(dto.getArrivedDate());
        newFishOrder.setDeliveryAddress(dto.getDeliveryAddress());
        newFishOrder.setTotal(dto.getTotal());
        newFishOrder.setBooking(booking);
        newFishOrder.setFarm(farm);
        newFishOrder.setIsDeleted(false);
        newFishOrder.setFishPackOrderDetails(null);
        newFishOrder.setFishOrderDetails(null);
        OrderRepository.save(newFishOrder);

        booking.getFishOrders().add(newFishOrder);
        BookingRepository.save(booking);

        return OrderRepository.save(newFishOrder);
    }

    public FishOrder updateFishOrder(String bookingId, String farmId, UpdateFishOrderDTO dto) {
        Optional<FishOrder> findOrder = OrderRepository.findFishOrderByBookingIdAndFarmId(bookingId, farmId);
        if (findOrder.isEmpty()) {
            throw new RuntimeException("Fish order not found");
        }
        FishOrder updateOrder = findOrder.get();

        updateOrder.setTotal(dto.getTotal());
        updateOrder.setStatus(dto.getStatus());
        updateOrder.setPaymentStatus(dto.getPaymentStatus());
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

    public FishOrder addFishPackOrFishOrderDetailToOrder(String bookingId, String farmId, String addId){
        Optional<FishOrder> findOrder = OrderRepository.findFishOrderByBookingIdAndFarmId(bookingId,farmId);
        if(findOrder.isEmpty()){
            throw new RuntimeException("Fish Order does not existed !");
        }
        FishOrder fishOrder = findOrder.get();
        Optional<FishOrderDetail> findOrderDetail = FODRepository.findById(addId);
        Optional<FishPackOrderDetail> findPackDetail = FPODRepository.findById(addId);

        if(findOrderDetail.isEmpty() && findPackDetail.isEmpty()){
            throw new RuntimeException("Fish Pack Order and Fish Order does not existed !");
        }
        else if(findOrderDetail.isPresent()){
            FishOrderDetail orderDetail = findOrderDetail.get();
            fishOrder.getFishOrderDetails().add(orderDetail);
            orderDetail.setFishOrder(fishOrder);
            FODRepository.save(orderDetail);
        }
        else if(findPackDetail.isPresent()){
            FishPackOrderDetail packOrderDetail = findPackDetail.get();
            fishOrder.getFishPackOrderDetails().add(packOrderDetail);
            packOrderDetail.setFishOrder(fishOrder);
            FPODRepository.save(packOrderDetail);
        }
        return OrderRepository.save(fishOrder);
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
        if(fishOrders == null){
            return null;
        }
        for (FishOrder fishOrder : fishOrders) {
            List<FishOrderDetail> findFOD = FODRepository.findByFishOrderId(fishOrder.getId());
            List<FishPackOrderDetail> findFPOD = FPODRepository.findFishPackOrderDetailsByFishOrderId(fishOrder.getId());
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

        dto.setId(fishOrder.getId());
        dto.setStatus(fishOrder.getStatus());
        dto.setPaymentStatus(fishOrder.getPaymentStatus());
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

    public List<DeliveryStaffOrderDTO> getFishOrdersByDeliveryStaffId(String deliveryStaffId) {
        List<FishOrder> fishOrders = OrderRepository.findByBooking_DeliveryStaff_Id(deliveryStaffId);
        return fishOrders.stream()
                .map(fishOrderMapper::toDeliveryStaffOrderDTO)
                .collect(Collectors.toList());
    }

    public List<FishOrderDTO> getFishOrdersByCustomerId(String customerId) {
        List<FishOrder> fishOrders = OrderRepository.findByBooking_Customer_Id(customerId);
        return fishOrders.stream()
                .map(fishOrderMapper::toDTO)
                .collect(Collectors.toList());
    }


}