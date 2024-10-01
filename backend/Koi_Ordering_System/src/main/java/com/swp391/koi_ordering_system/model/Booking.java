package com.swp391.koi_ordering_system.model;

import com.fasterxml.jackson.annotation.*;
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
@Table(name = "bookings")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Booking {
    @Id
    @Column(name = "id", nullable = false, length = 9)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Account customer;

    @JsonManagedReference
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @Column(name = "description")
    private String description;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @Column(name = "status", length = 20)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_staff_id")
    private Account saleStaff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consulting_staff_id")
    private Account consultingStaff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_staff_id")
    private Account deliveryStaff;

    @ColumnDefault("false")
    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

}