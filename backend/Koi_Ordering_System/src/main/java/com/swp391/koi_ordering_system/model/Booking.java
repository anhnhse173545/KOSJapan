package com.swp391.koi_ordering_system.model;

import com.fasterxml.jackson.annotation.*;
import com.swp391.koi_ordering_system.dto.response.FishOrderDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "bookings")

public class Booking {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "customer_id")
    private Account customer;

    @JsonManagedReference(value = "booking-trip")
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @Column(name = "description")
    private String description;

    @CreationTimestamp
    @Column(name = "create_at")
    private LocalDateTime createAt;

    @JsonManagedReference(value = "booking-tripPayment")
    @OneToOne(mappedBy = "booking")
    private TripPayment tripPayment;


    @Column(name = "status", length = 20)
    private String status = "Requested";

    @ManyToOne
    @JoinColumn(name = "sale_staff_id")
    private Account saleStaff;

    @ManyToOne
    @JoinColumn(name = "consulting_staff_id")
    private Account consultingStaff;

    @ManyToOne
    @JoinColumn(name = "delivery_staff_id")
    private Account deliveryStaff;

    @ColumnDefault("false")
    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @JsonManagedReference(value = "booking-fishOrder")
    @OneToMany(mappedBy = "booking")
    private List<FishOrder> fishOrders;

}