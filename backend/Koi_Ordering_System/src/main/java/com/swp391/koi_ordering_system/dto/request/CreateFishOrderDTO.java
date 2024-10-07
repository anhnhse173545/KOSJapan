package com.swp391.koi_ordering_system.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateFishOrderDTO {
    private String id;
    private String delivery_address;
    private Double total;
    private LocalDateTime create_at;
    private LocalDateTime arrive_date;
    private String status;
}
