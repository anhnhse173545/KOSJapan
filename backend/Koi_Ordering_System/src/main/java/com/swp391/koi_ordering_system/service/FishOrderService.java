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
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
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

    @Autowired
    private AccountRepository AccountRepository;

    @Autowired
    private AccountService AccountService;

    private static final String PREFIX = "PO";
    private static final int ID_PADDING = 4;
    @Autowired
    private OrderRepository orderRepository;

    public List<FishOrderDTO> getAllFishOrder() {
            List<FishOrder> list = OrderRepository.findAllByIsDeletedFalse();
            return list.stream()
                    .map(fishOrderMapper::toDTO)
                    .collect(Collectors.toList());
    }

    public List<FishOrderDTO> getAllByBookingId(String bookingId) {
        List<FishOrder> list = OrderRepository.findAllByBookingIdAndIsDeletedFalse(bookingId);
        return list.stream()
                .map(fishOrderMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<FishOrderDTO> getFishOrderByStatusByDeliveryStaff(String deliveryStaff, String status) {
        List<FishOrder> list = orderRepository.findByBooking_DeliveryStaff_IdAndStatusAndIsDeletedFalse(deliveryStaff, status);
        return list.stream()
                .map(fishOrderMapper::toDTO)
                .collect(Collectors.toList());
    }

    public FishOrder createFishOrder(String bookingId, String farmId) {
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


        Instant instant = Instant.now();
        LocalDateTime localDateTime = LocalDateTime.ofInstant(instant, ZoneId.systemDefault());

        newFishOrder.setId(generateOrderId());
        newFishOrder.setStatus("Pending");
        newFishOrder.setCreateAt(localDateTime);
        newFishOrder.setArrivedDate(null);
        newFishOrder.setTotal(0.00);
        newFishOrder.setBooking(booking);
        Account account = newFishOrder.getBooking().getCustomer();
        newFishOrder.setDeliveryAddress(newFishOrder.getBooking().getCustomer().getAddress());
        newFishOrder.setFarm(farm);
        newFishOrder.setIsDeleted(false);
        newFishOrder.setFishPackOrderDetails(null);
        newFishOrder.setFishOrderDetails(null);
        newFishOrder.setPaymentStatus("Pending");

        OrderRepository.save(newFishOrder);

        booking.getFishOrders().add(newFishOrder);
        BookingRepository.save(booking);
        AccountRepository.save(account);

        return OrderRepository.save(newFishOrder);
    }

    public FishOrder updateFishOrder(String bookingId, String farmId, UpdateFishOrderDTO dto) {
        Optional<FishOrder> findOrder = OrderRepository.findFishOrderByBookingIdAndFarmIdAndIsDeletedFalse(bookingId, farmId);
        if (findOrder.isEmpty()) {
            throw new RuntimeException("Fish order not found");
        }
        FishOrder updateOrder = findOrder.get();

        updateOrder.setStatus(dto.getStatus());
        updateOrder.setPaymentStatus(dto.getPaymentStatus());
        updateOrder.setDeliveryAddress(dto.getDelivery_address());
        updateOrder.setArrivedDate(dto.getArrived_date());

        return OrderRepository.save(updateOrder);
    }

    public void deleteFishOrder(String bookingId, String farmId) {
        Optional<FishOrder> findOrder = OrderRepository.findFishOrderByBookingIdAndFarmIdAndIsDeletedFalse(bookingId, farmId);
        if (findOrder.isEmpty()) {
            throw new RuntimeException("Fish order not found");
        }
        FishOrder deleteOrder = findOrder.get();

        deleteOrder.setIsDeleted(true);
        deleteOrder.setStatus(null);

        OrderRepository.save(deleteOrder);
    }

    public FishOrder removeFishOrderDetailInOrder(String orderId, String fishOrderDetail) {
        Optional<FishOrder> findOrder = OrderRepository.findByIdAndIsDeletedFalse(orderId);
        if (findOrder.isEmpty()) {
            throw new RuntimeException("Fish order not found");
        }
        FishOrder removeOrder = findOrder.get();
        Optional<FishOrderDetail> findFOD = FODRepository.findById(fishOrderDetail);
        if (findFOD.isEmpty()) {
            throw new RuntimeException("There is no Fish Pack or Fish Order Detail in this Order !");
        }

        FishOrderDetail foundFOD = findFOD.get();;
        removeOrder.getFishOrderDetails().remove(foundFOD);
        removeOrder.setTotal(removeOrder.getTotal() - foundFOD.getPrice());
        FODRepository.delete(foundFOD);
        OrderRepository.save(removeOrder); // Once remove from Fish Order => deleted

        return OrderRepository.save(removeOrder);
    }

    public FishOrder removeFishPackDetailInOrder(String orderId, String fishPackOrderDetailId) {
        Optional<FishOrder> findOrder = OrderRepository.findByIdAndIsDeletedFalse(orderId);
        if (findOrder.isEmpty()) {
            throw new RuntimeException("Fish order not found");
        }
        FishOrder removeOrder = findOrder.get();
        Optional<FishPackOrderDetail> findFPOD = FPODRepository.findById(fishPackOrderDetailId);
        if (findFPOD.isEmpty()) {
            throw new RuntimeException("There is no Fish Pack or Fish Order Detail in this Order !");
        }

        FishPackOrderDetail foundFPOD = findFPOD.get();;
        removeOrder.getFishPackOrderDetails().remove(foundFPOD);
        removeOrder.setTotal(removeOrder.getTotal() - foundFPOD.getPrice());
        FPODRepository.delete(foundFPOD); // Once remove from Fish Order => deleted

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

    public List<FishOrderDTO> getFishOrdersByDeliveryStaffId(String deliveryStaffId) {
        List<FishOrder> fishOrders = OrderRepository.findByBooking_DeliveryStaff_Id(deliveryStaffId);
        return fishOrders.stream()
                .map(fishOrderMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<FishOrderDTO> getFishOrdersByConsultingStaffId(String consultingStaffId) {
        List<FishOrder> fishOrders = OrderRepository.findByBooking_ConsultingStaff_Id(consultingStaffId);
        return fishOrders.stream()
                .map(fishOrderMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<FishOrderDTO> getFishOrdersByCustomerId(String customerId) {
        List<FishOrder> fishOrders = OrderRepository.findByBooking_Customer_Id(customerId);
        return fishOrders.stream()
                .map(fishOrderMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<FishOrderDTO> getFishOrderByBookingIdAndFarmId(String bookingId, String farmId) {
        List<FishOrder> list =OrderRepository.findByBookingIdAndFarmId(bookingId, farmId);
        return list.stream()
                .map(fishOrderMapper::toDTO)
                .collect(Collectors.toList());
    }

}