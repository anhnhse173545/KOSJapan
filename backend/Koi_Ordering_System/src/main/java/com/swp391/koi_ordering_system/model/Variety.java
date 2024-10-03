package com.swp391.koi_ordering_system.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "varieties")
public class Variety {
    @Id
    @Column(name = "id", nullable = false, length = 9)
    private String id;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "description")
    private String description;

    @ColumnDefault("false")
    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @JsonBackReference (value = "farm-variety")
    @ManyToMany
    @JoinTable(
            name = "farm_varieties",
            joinColumns = @JoinColumn(name = "farm_id"),
            inverseJoinColumns = @JoinColumn(name = "variety_id")
    )
    private Set<Variety> varieties;
}