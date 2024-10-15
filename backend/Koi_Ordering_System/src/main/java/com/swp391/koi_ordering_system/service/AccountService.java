package com.swp391.koi_ordering_system.service;


import com.swp391.koi_ordering_system.dto.request.CreateAccountDTO;
import com.swp391.koi_ordering_system.dto.response.AccountDTO;
import com.swp391.koi_ordering_system.model.Account;
import com.swp391.koi_ordering_system.model.FishOrderDetail;
import com.swp391.koi_ordering_system.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;

    private static final String PREFIX = "AC";
    private static final int ID_PADDING = 4;

    public List<AccountDTO> getAllAccounts() {
        List<Account> accounts = accountRepository.findAll();
        return accounts.stream()
                .map((Account) -> mapToDTO(Account))
                .collect(Collectors.toList());
    }

    public AccountDTO getAccountById(String accountId) {
        Account account = accountRepository.findById(accountId).orElse(null);
        return mapToDTO(account);
    }

    public List<AccountDTO> getAccountByRole(String role) {
        List<Account> accounts = accountRepository.findAccountsByRole(role);
        return accounts.stream()
                .map((Account) -> mapToDTO(Account))
                .collect(Collectors.toList());
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

    public Account updateAccount(String accountId, CreateAccountDTO accountDTO) {
        Optional<Account> findAcc = accountRepository.findById(accountId);
        if (findAcc.isEmpty()) {
            throw new RuntimeException("Account not found");
        }
        Account acc = findAcc.get();

        acc.setName(accountDTO.getName());
        acc.setPhone(accountDTO.getPhone());
        acc.setEmail(accountDTO.getEmail());
        acc.setPassword(accountDTO.getPassword());
        acc.setPhone(accountDTO.getPhone());
        acc.setAddress(accountDTO.getAddress());
        acc.setProfileImg(accountDTO.getProfile_image());
        acc.setRole(accountDTO.getRole());

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
        accountDTO.setProfile_image(account.getProfileImg());
        accountDTO.setRole(account.getRole());

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