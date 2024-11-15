package com.swp391.koi_ordering_system.service;


import com.swp391.koi_ordering_system.dto.request.CreateAccountDTO;
import com.swp391.koi_ordering_system.dto.response.AccountDTO;
import com.swp391.koi_ordering_system.mapper.AccountMapper;
import com.swp391.koi_ordering_system.model.Account;
import com.swp391.koi_ordering_system.repository.AccountRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;  
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountMapper accountMapper;

    private static final String PREFIX = "AC";
    private static final int ID_PADDING = 4;

    public List<AccountDTO> getAllAccounts() {
        List<Account> accounts = accountRepository.findAll();
        return accounts.stream()
                .map(accountMapper::toDTO)
                .collect(Collectors.toList());
    }

    public AccountDTO getAccountById(String accountId) {
        Account account = accountRepository.findById(accountId).orElse(null);
        return mapToDTO(account);
    }

    public List<AccountDTO> getAccountByRole(String role) {
        List<Account> accounts = accountRepository.findAccountsByRole(role);
        return accounts.stream()
                .map(accountMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Account getAccountByPhone(String phone) {
        Account account = accountRepository.findByPhone(phone);
        if (account == null) {
            throw new RuntimeException("Account with phone number " + phone + " not found");
        }
        return account;
    }

    public Account createAccount(CreateAccountDTO accountDTO) {
        Account newAccount = new Account();
        Account acc1 = accountRepository.findByEmail(accountDTO.getEmail());
        Account acc2 = accountRepository.findByPhone(accountDTO.getPhone());

        newAccount.setId(generateAccountId());
        newAccount.setName(accountDTO.getName());
        newAccount.setEmail(accountDTO.getEmail());
        newAccount.setPassword(accountDTO.getPassword());
        newAccount.setPhone(accountDTO.getPhone());
        newAccount.setAddress(accountDTO.getAddress());
        newAccount.setRole(accountDTO.getRole());

        if (acc1 != null) {
            throw new RuntimeException("Email already in use");
        } else if (acc2 != null) {
            throw new RuntimeException("Phone already in use");
        }
        return accountRepository.save(newAccount);
    }

    public void restoreAccount (String accountId) {
        Optional<Account> findAccount = accountRepository.findByIdAndIsDeletedTrue(accountId);
        if (findAccount.isEmpty()) {
            throw new EntityNotFoundException("Account not found");
        }
        Account foundAccount = findAccount.get();
        foundAccount.setIsDeleted(false);
        accountRepository.save(foundAccount);
    }

    public Account updateAccount(String accountId, CreateAccountDTO accountDTO) {
        Optional<Account> findAcc = accountRepository.findById(accountId);
        if (findAcc.isEmpty()) {
            throw new RuntimeException("Account not found");
        }
        Account acc = findAcc.get();

        if (accountDTO.getName() != null && !accountDTO.getName().isEmpty()) {
            acc.setName(accountDTO.getName());
        }

        if (accountDTO.getPhone() != null && !accountDTO.getPhone().isEmpty()) {
            acc.setPhone(accountDTO.getPhone());
        }

        if (accountDTO.getEmail() != null && !accountDTO.getEmail().isEmpty()) {
            acc.setEmail(accountDTO.getEmail());
        }

        if (accountDTO.getAddress() != null && !accountDTO.getAddress().isEmpty()) {
            acc.setAddress(accountDTO.getAddress());
        }

        if (accountDTO.getRole() != null && !accountDTO.getRole().isEmpty()) {
            acc.setRole(accountDTO.getRole());
        }

        return accountRepository.save(acc);
    }

    public void deleteAccount(String accountId) {
        Optional<Account> findAcc = accountRepository.findById(accountId);
        if (findAcc.isEmpty()) {
            throw new RuntimeException("Account not found");
        }
        Account foundAcc = findAcc.get();
        foundAcc.setIsDeleted(true);
        accountRepository.save(foundAcc);
    }


    public AccountDTO mapToDTO(Account account) {
        AccountDTO accountDTO = new AccountDTO();
        if (account == null) {
            return null;
        }
        accountDTO.setId(account.getId());
        accountDTO.setName(account.getName());
        accountDTO.setEmail(account.getEmail());
        accountDTO.setPhone(account.getPhone());
        accountDTO.setRole(account.getRole());
        accountDTO.setAddress(account.getAddress());

        return accountDTO;
    }



    private String generateAccountId() {
        String lastId = accountRepository.findTopByOrderByIdDesc()
                .map(Account::getId)
                .orElse(PREFIX + String.format("%0" + ID_PADDING + "d", 0));

        try {
            int nextId = Integer.parseInt(lastId.substring(PREFIX.length())) + 1;
            return PREFIX + String.format("%0" + ID_PADDING + "d", nextId);

        } catch (NumberFormatException e) {
            throw new IllegalStateException("Invalid order detail ID format: " + lastId, e);
        }
    }
}