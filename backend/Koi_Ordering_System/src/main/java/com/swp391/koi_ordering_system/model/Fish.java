package com.swp391.koi_ordering_system.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.util.Set;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "fishes")
public class Fish {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @ManyToOne
    @JoinColumn(name = "variety_id")
    private Variety variety;

    @Column(name = "length")
    private Double length;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "description")
    private String description;

    @ColumnDefault("false")
    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @JsonManagedReference(value = "fish-media")
    @ManyToMany
    @JoinTable(
            name = "fish_medias",
            joinColumns = @JoinColumn(name = "fish_id"),
            inverseJoinColumns = @JoinColumn(name = "media_id")
    )
    private Set<Media> medias;

}