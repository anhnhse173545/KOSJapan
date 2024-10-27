package com.swp391.koi_ordering_system.dto.response;

import com.swp391.koi_ordering_system.model.Media;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FarmDTO {
    private String id;
    private String address;
    private String phoneNumber;
    private String name;
    private String description;
    private Set<VarietyDTO> varieties;
    private String mediaUrl;


}