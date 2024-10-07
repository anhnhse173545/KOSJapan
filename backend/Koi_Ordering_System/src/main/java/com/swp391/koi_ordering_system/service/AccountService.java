package com.swp391.koi_ordering_system.service;

import com.swp391.koi_ordering_system.dto.AccountDTO;
import com.swp391.koi_ordering_system.model.Account;

import java.util.List;

public interface AccountService {
    List<AccountDTO> getAllAccounts(); //view
    Account createNewAccount(Account account);
    AccountDTO getAccountById(String id);
    Account updateAccount(String id ,Account account);
    void deleteAccount(String id);
}
