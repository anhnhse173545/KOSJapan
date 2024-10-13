package com.swp391.koi_ordering_system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "fish_pack_order_details")
public class FishPackOrderDetail {
    @Id
    @Column(name = "id")
    private String id;

    @ManyToOne
    @JoinColumn(name = "fish_order_id", nullable = true)
    private FishOrder fishOrder;

    @ManyToOne
    @JoinColumn(name = "fish_pack_id")
    private FishPack fishPack;

    @Column(name = "price")
    private Double price;

    @ColumnDefault("false")
    @Column(name = "is_deleted")
    private Boolean isDeleted;

}