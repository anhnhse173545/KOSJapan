package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.CreateFishOrderDTO;
import com.swp391.koi_ordering_system.dto.request.CreateTripDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateBookingDTO;
import com.swp391.koi_ordering_system.dto.response.BookingDTO;
import com.swp391.koi_ordering_system.dto.response.FishOrderDTO;
import com.swp391.koi_ordering_system.dto.response.TripDTO;
import com.swp391.koi_ordering_system.mapper.BookingMapper;
import com.swp391.koi_ordering_system.mapper.TripMapper;
import com.swp391.koi_ordering_system.model.Account;
import com.swp391.koi_ordering_system.model.Booking;
import com.swp391.koi_ordering_system.model.FishOrder;
import com.swp391.koi_ordering_system.model.Trip;
import com.swp391.koi_ordering_system.repository.AccountRepository;
import com.swp391.koi_ordering_system.repository.BookingRepository;
import com.swp391.koi_ordering_system.repository.OrderRepository;
import com.swp391.koi_ordering_system.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TripService tripService;

    @Autowired
    private BookingMapper bookingMapper;

    @Autowired
    private TripMapper tripMapper;

    @Autowired
    private OrderRepository fishOrderRepo;

    public Booking createBooking(Booking booking) {
        booking.setId(generateBookingId());
        return bookingRepository.save(booking);
    }

    public List<BookingDTO> getAllBooking() {
        return bookingRepository.findAllByIsDeletedFalse().stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<BookingDTO> getBookingById(String id) {
        return bookingRepository.findByIdAndIsDeletedFalse(id)
                .map(bookingMapper::toDTO);
    }

    public List<BookingDTO> getBookingsByCustomerId(String customerId) {
        return bookingRepository.findByCustomerIdAndIsDeletedFalse(customerId).stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Booking updateBooking(String bookingId, UpdateBookingDTO updateBookingDTO) {
        Booking booking = bookingRepository.findByIdAndIsDeletedFalse(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (updateBookingDTO.getSaleStaffId() != null) {
            Account saleStaff = accountRepository.findById(updateBookingDTO.getSaleStaffId())
                    .orElseThrow(() -> new RuntimeException("Sale staff not found"));
            booking.setSaleStaff(saleStaff);
        }

        if (updateBookingDTO.getConsultingStaffId() != null) {
            Account consultingStaff = accountRepository.findById(updateBookingDTO.getConsultingStaffId())
                    .orElseThrow(() -> new RuntimeException("Consulting staff not found"));
            booking.setConsultingStaff(consultingStaff);
        }

        if (updateBookingDTO.getDeliveryStaffId() != null) {
            Account deliveryStaff = accountRepository.findById(updateBookingDTO.getDeliveryStaffId())
                    .orElseThrow(() -> new RuntimeException("Delivery staff not found"));
            booking.setDeliveryStaff(deliveryStaff);
        }

        return bookingRepository.save(booking);
    }

    public Booking deleteBooking(String id) {
        Booking booking = bookingRepository.findByIdAndIsDeletedFalse(id).orElse(null);
        if (booking != null) {
            booking.setIsDeleted(true);
            return bookingRepository.save(booking);
        }
        return null;
    }

    public TripDTO createTripForBooking(String bookingId, CreateTripDTO createTripDTO) {
        Booking booking = bookingRepository.findByIdAndIsDeletedFalse(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Trip trip = tripMapper.toEntity(createTripDTO);
        trip.setBooking(booking);
        Trip savedTrip = tripService.createTrip(trip);

        booking.setTrip(savedTrip);
        bookingRepository.save(booking);

        return tripMapper.toDTO(savedTrip);
    }

    public Optional<Trip> getTripByBookingId(String bookingId) {
        return tripRepository.findByBookingIdAndBookingIsDeletedFalse(bookingId);
    }

    public List<FishOrderDTO> getAllFishOrderByBookingId(String bookingID){
        return fishOrderRepo.findByBookingId(bookingID).stream()
                .map((fishOrder -> mapToDTO(fishOrder)))
                .collect(Collectors.toList());
    }

//  Can them cai OrderDetail va Order Service !!
//    public List<CreateFishOrderDTO> addOrdersToBooking(String bookingID){
//        List<FishOrder> newList = fishOrderRepo.findAllByBookingId(bookingID);
//        if( !newList.isEmpty()){
//            throw new RuntimeException("Orders existed !");
//        }
//        return newList.stream()
//                .map((FishOrder) -> mapToDTO2(FishOrder))
//                .collect(Collectors.toList());
//    }

    public CreateFishOrderDTO mapToDTO2 (FishOrder fishOrder){
        CreateFishOrderDTO createFishOrderDTO = new CreateFishOrderDTO();

        createFishOrderDTO.setId(fishOrder.getId());
        createFishOrderDTO.setDelivery_address(fishOrder.getDeliveryAddress());
        createFishOrderDTO.setTotal(fishOrder.getTotal());
        createFishOrderDTO.setStatus(fishOrder.getStatus());
        createFishOrderDTO.setCreate_at(fishOrder.getCreateAt());
        createFishOrderDTO.setArrive_date(fishOrder.getArrivedDate());

        return createFishOrderDTO;
    }

    public FishOrderDTO mapToDTO(FishOrder fishOrder){
        FishOrderDTO fishOrderDTO = new FishOrderDTO();

        fishOrderDTO.setId(fishOrder.getId());
        fishOrderDTO.setTotal(fishOrder.getTotal());
        fishOrderDTO.setStatus(fishOrder.getStatus());
        fishOrderDTO.setDeliveryAddress(fishOrder.getDeliveryAddress());

        return fishOrderDTO;
    }

    public FishOrder mapToEnity(FishOrderDTO fishOrderDTO){
        FishOrder fishOrder = new FishOrder();

        fishOrder.setId(fishOrderDTO.getId());
        fishOrder.setTotal(fishOrderDTO.getTotal());
        fishOrder.setStatus(fishOrderDTO.getStatus());
        fishOrder.setDeliveryAddress(fishOrderDTO.getDeliveryAddress());

        return fishOrder;
    }

    private String generateBookingId() {
        String lastBookingId = bookingRepository.findTopByOrderByIdDesc()
                .map(Booking::getId)
                .orElse("BO0000");
        int nextId = Integer.parseInt(lastBookingId.substring(2)) + 1;
        return String.format("BO%04d", nextId);
    }



}
