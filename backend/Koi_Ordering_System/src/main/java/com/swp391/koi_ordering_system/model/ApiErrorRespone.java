package com.swp391.koi_ordering_system.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApiErrorRespone {
    private LocalDateTime timestamp;
    private HttpStatus status;
    private String message;
    private Map<String, String> errors;
}
