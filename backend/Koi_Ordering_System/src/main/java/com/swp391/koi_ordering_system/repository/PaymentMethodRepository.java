package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, String> {
}
