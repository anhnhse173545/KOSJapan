package com.swp391.koi_ordering_system.utils;

import com.swp391.koi_ordering_system.model.ApiErrorRespone;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ErrorHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorRespone> handleValidationExceptions(MethodArgumentNotValidException ex) {
        ApiErrorRespone apiError = new ApiErrorRespone(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST,
                "Validation failed",
                getValidationErrors(ex)
        );
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    private Map<String, String> getValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        return errors;
    }
}
