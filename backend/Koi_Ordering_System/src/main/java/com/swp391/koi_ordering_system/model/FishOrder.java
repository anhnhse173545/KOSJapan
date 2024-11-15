package com.swp391.koi_ordering_system.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@Table(name = "fish_orders")
public class FishOrder {
    @Id
    @Column(name = "id")
    private String id;

    @JsonBackReference(value = "booking-fishOrder")
    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "farm_id")
    private Farm farm;

    @Column(name = "delivery_address")
    private String deliveryAddress;

    @Column(name = "total")
    private Double total = 0.0;

    @CreationTimestamp
    @Column(name = "create_at")
    private LocalDateTime createAt;

    @Column(name = "arrived_date")
    private LocalDateTime arrivedDate;

    @Column(name = "status")
    private String status;

    @Column(name = "payment_status")
    private String paymentStatus;

    @ColumnDefault("false")
    @Column(name = "is_deleted")
    private Boolean isDeleted;

//    @OneToMany(mappedBy = "fishOrder")
//    private Set<FishPackOrderDetail> fishPackOrderDetails;

    @OneToOne(mappedBy = "fishOrder")
    private FishPayment fishPayments;

    @JsonManagedReference(value = "fishOrder-fishOrderDetail")
    @OneToMany(mappedBy = "fishOrder")
    private List<FishOrderDetail> fishOrderDetails = new ArrayList<>();

    @JsonManagedReference(value = "fishOrder-fishPackOrderDetail")
    @OneToMany(mappedBy = "fishOrder")
    private List<FishPackOrderDetail> fishPackOrderDetails = new ArrayList<>();
}