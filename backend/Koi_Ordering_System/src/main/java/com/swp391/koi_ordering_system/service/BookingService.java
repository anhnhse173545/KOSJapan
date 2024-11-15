package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.request.*;
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
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountNotFoundException;
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
    private AuthService authService;

    @Autowired
    private TripPaymentService tripPaymentService;

    @Autowired
    private FishOrderService fishOrderService;

    public Booking createBooking(String cusId, CreateBookingDTO dto) {
        Optional<Account> acc = accountRepository.findById(cusId);
        if (acc.isEmpty()) {
            throw new EntityNotFoundException("Account not found");
        }
        Account assignAccount = acc.get();
        Booking booking = new Booking();

        booking.setId(generateBookingId());
        booking.setCustomer(assignAccount);
        booking.setDescription(dto.getDescription());

        return bookingRepository.save(booking);
    }

    public List<BookingDTO> getAllBooking() {
        return bookingRepository.findAllByIsDeletedFalse().stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getBookingsByStatus(String status) {
        return bookingRepository.findByStatusAndIsDeletedFalse(status).stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getBookingsByTripStatus(String status) {
        return bookingRepository.findByTripStatusAndIsDeletedFalse(status).stream()
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

    public List<BookingDTO> getBookingsBySaleStaffId(String saleStaffId) {
        return bookingRepository.findBySaleStaffIdAndIsDeletedFalse(saleStaffId).stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getBookingsByConsultingStaffId(String consultingStaffId) {
        return bookingRepository.findByConsultingStaffIdAndIsDeletedFalse(consultingStaffId).stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getBookingsByDeliveryStaffId(String deliveryStaffId) {
        return bookingRepository.findByDeliveryStaffIdAndIsDeletedFalse(deliveryStaffId).stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }


    public BookingDTO updateBooking(String bookingId, UpdateBookingDTO updateBookingDTO) {
        Booking booking = bookingRepository.findByIdAndIsDeletedFalse(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Set<String> salesStatuses = Set.of("Requested", "Pending Quote", "Approved Quote", "Paid Booking", "Cancelled");
        Set<String> consultingStatuses = Set.of("On-going", "Order Prepare");
        Set<String> deliveryStatuses = Set.of("Completed");
        String customerStatuses = "Canceled";

        boolean isCustomer = authService.isRole("ROLE_Customer");

//        boolean isManager = authService.isRole("ROLE_Manager");

        boolean isManager = true;

        boolean isSalesStaff = authService.isRole("ROLE_Sales_Staff");

        boolean isConsultingStaff = authService.isRole("ROLE_Consulting_Staff");

        boolean isDeliveryStaff = authService.isRole("ROLE_Delivery_Staff");


        if (updateBookingDTO.getTripId() != null) {
            if (!isManager && !isSalesStaff) {
                throw new AccessDeniedException("Unauthorized to update trip");
            }
            Trip trip = tripRepository.findByIdAndIsDeletedFalse(updateBookingDTO.getTripId())
                    .orElseThrow(() -> new EntityNotFoundException("Trip not found"));
            booking.setTrip(trip);
        }

        if (updateBookingDTO.getSaleStaffId() != null) {
            if (!isManager) {
                throw new AccessDeniedException("Unauthorized to update sale staff");
            }
            Account saleStaff = accountRepository.findByIdAndIsDeletedFalseAndRole(updateBookingDTO.getSaleStaffId(), "Sales Staff")
                    .orElseThrow(() -> new EntityNotFoundException("Sales staff not found"));
            booking.setSaleStaff(saleStaff);
        }

        if (updateBookingDTO.getConsultingStaffId() != null) {
            if (!isManager) {
                throw new AccessDeniedException("Unauthorized to update consulting staff");
            }
            Account consultingStaff = accountRepository.findByIdAndIsDeletedFalseAndRole(updateBookingDTO.getConsultingStaffId(), "Consulting Staff")
                    .orElseThrow(() -> new EntityNotFoundException("Consulting staff not found"));
            booking.setConsultingStaff(consultingStaff);
        }

        if (updateBookingDTO.getDeliveryStaffId() != null) {
            if (!isManager) {
                throw new AccessDeniedException("Unauthorized to update delivery staff");
            }
            Account deliveryStaff = accountRepository.findByIdAndIsDeletedFalseAndRole(updateBookingDTO.getDeliveryStaffId(), "Delivery Staff")
                    .orElseThrow(() -> new EntityNotFoundException("Delivery staff not found"));
            booking.setDeliveryStaff(deliveryStaff);
        }

        if (updateBookingDTO.getDescription() != null) {
            if (!isManager && !isCustomer) {
                throw new AccessDeniedException("Unauthorized to update description");
            }
            booking.setDescription(updateBookingDTO.getDescription());
        }

        if (updateBookingDTO.getStatus() != null) {
            if (isManager) {
                booking.setStatus(updateBookingDTO.getStatus());
            } else if (isCustomer && updateBookingDTO.getStatus().equals(customerStatuses)) {
                booking.setStatus(updateBookingDTO.getStatus());
            } else if (isSalesStaff && salesStatuses.contains(updateBookingDTO.getStatus())) {
                booking.setStatus(updateBookingDTO.getStatus());
            } else if (isConsultingStaff && consultingStatuses.contains(updateBookingDTO.getStatus())) {
                booking.setStatus(updateBookingDTO.getStatus());
            } else if (isDeliveryStaff && deliveryStatuses.contains(updateBookingDTO.getStatus())) {
                booking.setStatus(updateBookingDTO.getStatus());
            } else {
                throw new AccessDeniedException("Unauthorized to update status");
            }
        }

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

    public TripDTO createTripForBooking(String bookingId, @Valid CreateTripDTO createTripDTO) {
        Booking booking = bookingRepository.findByIdAndIsDeletedFalse(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));

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


    public Booking updateOrderToBooking(String bookingId, String orderId) {
        Optional<Booking> booking = bookingRepository.findByIdAndIsDeletedFalse(bookingId);
        Optional<FishOrder> findOrder = fishOrderRepo.findFishOrderByBookingId(bookingId);
        Optional<FishOrder> order = fishOrderRepo.findById(orderId);
        if (booking.isEmpty()) {
            throw new EntityNotFoundException("Booking not found");
        } else if (findOrder.isEmpty()) {
            throw new EntityNotFoundException("Order In Booking not found");
        } else if (order.isEmpty()) {
            throw new EntityNotFoundException("Order not found");
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

    public Booking removeOrderFromBooking(String bookingId, String orderId) {
        Optional<Booking> booking = bookingRepository.findByIdAndIsDeletedFalse(bookingId);
        Optional<FishOrder> order = fishOrderRepo.findById(orderId);
        if (booking.isEmpty()) {
            throw new EntityNotFoundException("Booking not found");
        } else if (order.isEmpty()) {
            throw new EntityNotFoundException("Order not found");
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

        if (booking == null) {
            return null;
        }

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

    public List<BookingDTO> getBookingsBySaleStaffIdAndCustomerId(String saleStaffId, String customerId) {
        return bookingRepository.findBySaleStaffIdAndCustomerIdAndIsDeletedFalse(saleStaffId, customerId)
                .stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }


}
