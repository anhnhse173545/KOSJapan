package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findTopByOrderByIdDesc();
    Account findByEmail(String email);
    Account findByPhone(String phone);
    List<Account> findAccountsByRole(String role);
//    Account findByUsername(String username);
Optional<Account> findByIdAndIsDeletedFalseAndRole(String id, String role);
}

