//package com.swp391.koi_ordering_system.controller;
//
//import com.swp391.koi_ordering_system.dto.request.CreateBookingDTO;
//import com.swp391.koi_ordering_system.dto.request.CreateFishOrderDTO;
//import com.swp391.koi_ordering_system.dto.response.BookingDTO;
//import com.swp391.koi_ordering_system.dto.response.FarmDTO;
//import com.swp391.koi_ordering_system.dto.response.FishOrderDTO;
//import com.swp391.koi_ordering_system.mapper.FishOrderMapper;
//import com.swp391.koi_ordering_system.model.Booking;
//import com.swp391.koi_ordering_system.model.Farm;
//import com.swp391.koi_ordering_system.model.FishOrder;
//import com.swp391.koi_ordering_system.service.OrderService;
//import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/orders")
//public class OrderController {
//
//    @Autowired
//    private OrderService orderService;
//
//    @Autowired
//    private FishOrderMapper fishOrderMapper;
//
//    @RequestMapping("/fish/create")
//    public ResponseEntity<FishOrderDTO> createFishOrder(@RequestBody CreateFishOrderDTO createFishOrderDTO) {
//        return ResponseEntity.ok(orderService.createFishOrder(createFishOrderDTO));
//    }
//
//
//    @GetMapping("/list")
//    public ResponseEntity<List<FishOrderDTO>> getAllFarm() {
//        return ResponseEntity.ok(orderService.getAllOrder());
//    }
//
//}