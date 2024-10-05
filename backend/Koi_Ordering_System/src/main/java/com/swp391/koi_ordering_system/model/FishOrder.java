package com.swp391.koi_ordering_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "fish_orders")
public class FishOrder {
    @Id
    @Column(name = "id", nullable = false, length = 9)
    private String id;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @Column(name = "delivery_address")
    private String deliveryAddress;

    @Column(name = "total")
    private Double total;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @Column(name = "arrived_date")
    private LocalDateTime arrivedDate;

    @Column(name = "status", length = 50)
    private String status;

    @ColumnDefault("false")
    @Column(name = "is_deleted")
    private Boolean isDeleted;

}