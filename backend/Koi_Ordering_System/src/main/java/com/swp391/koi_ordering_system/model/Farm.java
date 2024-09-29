package com.swp391.koi_ordering_system.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "farms")
public class Farm {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "address")
    private String address;

    @Column(name = "phone_number", length = 11)
    private String phoneNumber;

    @ColumnDefault("false")
    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @Column(name = "name")
    private String name;

    @Column(name = "phone")
    private String phone;

    @ManyToMany
    @JoinTable(
            name = "farm_varieties",
            joinColumns = @JoinColumn(name = "farm_id"),
            inverseJoinColumns = @JoinColumn(name = "variety_id")
    )
    private Set<Variety> varieties;

    @ManyToMany(mappedBy = "farms")
    private Set<Trip> trips;
}