package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.CreateFishOrderDTO;
import com.swp391.koi_ordering_system.dto.request.CreateTripDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateBookingDTO;
import com.swp391.koi_ordering_system.dto.request.UpdateTripDTO;
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

import java.util.*;
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

    @Autowired
    private FishOrderService orderService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private TripPaymentService tripPaymentService;

    @Autowired
    private FishOrderService fishOrderService;

    public Booking createBooking(Booking booking) {
        booking.setId(generateBookingId());
        return bookingRepository.save(booking);
    }

    public List<BookingDTO> getAllBooking() {
        return bookingRepository.findAllByIsDeletedFalse().stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getBookingsByStatusRequested() {
        return bookingRepository.findByStatusAndIsDeletedFalse("requested").stream()
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


    public BookingDTO updateBooking(String bookingId, UpdateBookingDTO updateBookingDTO) {
        Booking booking = bookingRepository.findByIdAndIsDeletedFalse(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (updateBookingDTO.getTripId() != null) {
            Trip trip = tripRepository.findByIdAndIsDeletedFalse(updateBookingDTO.getTripId())
                    .orElseThrow(() -> new RuntimeException("Trip not found"));
            booking.setTrip(trip);
        }

        if (updateBookingDTO.getSaleStaffId() != null) {
            Account saleStaff = accountRepository.findByIdAndIsDeletedFalseAndRole(updateBookingDTO.getSaleStaffId(), "Sale Staff")
                    .orElseThrow(() -> new RuntimeException("Sale staff not found"));
            booking.setSaleStaff(saleStaff);
        }

        if (updateBookingDTO.getConsultingStaffId() != null) {
            Account consultingStaff = accountRepository.findByIdAndIsDeletedFalseAndRole(updateBookingDTO.getConsultingStaffId(), "Consulting Staff")
                    .orElseThrow(() -> new RuntimeException("Consulting staff not found"));
            booking.setConsultingStaff(consultingStaff);
        }

        if (updateBookingDTO.getDeliveryStaffId() != null) {
            Account deliveryStaff = accountRepository.findByIdAndIsDeletedFalseAndRole(updateBookingDTO.getDeliveryStaffId(), "Delivery Staff")
                    .orElseThrow(() -> new RuntimeException("Delivery staff not found"));
            booking.setDeliveryStaff(deliveryStaff);
        }

        booking.setDescription(updateBookingDTO.getDescription());
        booking.setStatus(updateBookingDTO.getStatus());

        return bookingMapper.toDTO(bookingRepository.save(booking));
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

    public List<BookingDTO> getBookingsByStatusAndCustomerIdForSaleStaff(String customerId) {
        if (!accountRepository.findByIdAndIsDeletedFalseAndRole(customerId, "Customer").isPresent()) {
            throw new RuntimeException("Customer not found");
        }
        List<String> statuses = List.of("Requested", "Waiting For Approved", "Approved", "Declined");
        return bookingRepository.findByStatusInAndCustomerIdAndIsDeletedFalse(statuses, customerId).stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getBookingsByStatusForSaleStaff() {
        List<String> statuses = List.of("Requested", "Pending", "Approved");
        return bookingRepository.findByStatusInAndIsDeletedFalse(statuses).stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getBookingsByStatusForSaleStaffByCustomer() {
        List<String> statuses = List.of("Requested", "Pending", "Approved");
        return bookingRepository.findByStatusInAndIsDeletedFalse(statuses).stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getBookingsByStatusForConsultingStaff() {
        List<String> statuses = List.of("Confirmed", "Ongoing");
        return bookingRepository.findByStatusInAndIsDeletedFalse(statuses).stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Booking updateOrderToBooking(String bookingId, String orderId){
        Optional<Booking> booking = bookingRepository.findByIdAndIsDeletedFalse(bookingId);
        Optional<FishOrder> findOrder = fishOrderRepo.findFishOrderByBookingId(bookingId);
        Optional<FishOrder> order = fishOrderRepo.findById(orderId);
        if (booking.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }
        else if (findOrder.isEmpty()) {
            throw new RuntimeException("Order In Booking not found");
        }
        else if(order.isEmpty()){
            throw new RuntimeException("Order not found");
        }
        Booking sameBooking = booking.get();
        FishOrder oldOrder = findOrder.get();
        FishOrder addOrder = order.get();

        int index = sameBooking.getFishOrders().indexOf(oldOrder);
        sameBooking.getFishOrders().set(index, addOrder);
        addOrder.setBooking(sameBooking);

        fishOrderRepo.save(addOrder);
        return bookingRepository.save(sameBooking);
    }

    public Booking removeOrderFromBooking(String bookingId, String orderId){
        Optional<Booking> booking = bookingRepository.findByIdAndIsDeletedFalse(bookingId);
        Optional<FishOrder> order = fishOrderRepo.findById(orderId);
        if (booking.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }
        else if (order.isEmpty()) {
            throw new RuntimeException("Order not found");
        }
        Booking sameBooking = booking.get();
        FishOrder removeOrder = order.get();

        sameBooking.getFishOrders().remove(removeOrder);
        removeOrder.setIsDeleted(true);

        fishOrderRepo.save(removeOrder);
        return bookingRepository.save(sameBooking);
    }

    public BookingDTO mapToDTO(Booking booking) {
        BookingDTO bookingDTO = new BookingDTO();

        bookingDTO.setId(booking.getId());
        bookingDTO.setCustomer(accountService.mapToDTO(booking.getCustomer()));
        bookingDTO.setStatus(booking.getStatus());
        bookingDTO.setDescription(booking.getDescription());
        bookingDTO.setTrip(tripService.mapToDTO(booking.getTrip()));
        bookingDTO.setSaleStaff(accountService.mapToDTO(booking.getSaleStaff()));
        bookingDTO.setDeliveryStaff(accountService.mapToDTO(booking.getDeliveryStaff()));
        bookingDTO.setConsultingStaff(accountService.mapToDTO(booking.getConsultingStaff()));
        bookingDTO.setCreateAt(booking.getCreateAt());
        bookingDTO.setTripPayment(tripPaymentService.mapToDTO(booking.getTripPayment()));

        List<FishOrder> orders = booking.getFishOrders();
        List<FishOrderDTO> orderDTOs = new ArrayList<>();
        for (FishOrder order : orders) {
            FishOrderDTO fishOrderDTO = new FishOrderDTO();
            fishOrderDTO = fishOrderService.mapToDTO2(order);
            orderDTOs.add(fishOrderDTO);
        }
        bookingDTO.setFishOrders(orderDTOs);

        return bookingDTO;
    }

    private String generateBookingId() {
        String lastBookingId = bookingRepository.findTopByOrderByIdDesc()
                .map(Booking::getId)
                .orElse("BO0000");
        int nextId = Integer.parseInt(lastBookingId.substring(2)) + 1;
        return String.format("BO%04d", nextId);
    }

    public Optional<BookingDTO> getBookingByTripId(String tripId) {
        return bookingRepository.findByTripIdAndIsDeletedFalse(tripId)
                .map(bookingMapper::toDTO);
    }



}
