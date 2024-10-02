package com.swp391.koi_ordering_system.repository;

import com.swp391.koi_ordering_system.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, String> {
    Account findByUsername(String username);
}
