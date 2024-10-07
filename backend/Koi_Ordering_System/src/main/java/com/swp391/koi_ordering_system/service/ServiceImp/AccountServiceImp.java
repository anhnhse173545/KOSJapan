package com.swp391.koi_ordering_system.service.ServiceImp;

import com.swp391.koi_ordering_system.dto.AccountDTO;
import com.swp391.koi_ordering_system.model.Account;
import com.swp391.koi_ordering_system.repository.AccountRepository;
import com.swp391.koi_ordering_system.service.AccountService;
//import com.swp.KoiOrderSystem.utils.AutoGenerateIDPattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImp implements AccountService {

    private AccountRepository repo;

    @Autowired
    public AccountServiceImp(AccountRepository repo) {
        this.repo = repo;
    }

//    @Autowired
//    private AutoGenerateIDPattern autoGenerateID;

    @Override
    public List<AccountDTO> getAllAccounts() {
        List<Account> accounts = repo.findAll();
        return accounts.stream().map((account) -> mapToDTO(account)).collect(Collectors.toList());
    }

    @Override
    public Account createNewAccount(Account account) {
        Account newAccount = new Account();

        newAccount.setId(account.getId());
        newAccount.setUsername(account.getUsername());
        newAccount.setPassword(account.getPassword());
        newAccount.setRole(account.getRole());
        newAccount.setName(account.getName());
        newAccount.setAddress(account.getAddress());
        newAccount.setPhone(account.getPhone());
        newAccount.setIsDeleted(account.getIsDeleted());
        newAccount.setProfileImg(account.getProfileImg());

        return repo.save(newAccount);
    }

    @Override
    public AccountDTO getAccountById(String id) {
        Account acc = repo.findById(id).orElseThrow(() -> new RuntimeException("Account not found"));
        return mapToDTO(acc);
    }

    @Override
    public Account updateAccount(String id, Account account) {
        Account acc = repo.findById(id).orElseThrow(() -> new RuntimeException("Account can not be updated"));

        acc.setUsername(account.getUsername());
        acc.setRole(account.getRole());
        acc.setName(account.getName());
        acc.setAddress(account.getAddress());
        acc.setPhone(account.getPhone());
        acc.setIsDeleted(account.getIsDeleted());
        acc.setProfileImg(account.getProfileImg());
        return repo.save(acc);
    }

    @Override
    public void deleteAccount(String id) {
        Account acc = repo.findById(id).orElseThrow(() -> new RuntimeException("Account not found"));
        repo.delete(acc);
    }


    private AccountDTO mapToDTO(Account account) {
        AccountDTO accDTO = AccountDTO.builder()
                .id(account.getId())
                .username(account.getUsername())
                .name(account.getName())
                .phone(account.getPhone())
                .address(account.getAddress())
                .role(account.getRole())
                .profileImage(account.getProfileImg())
                .build();
        return accDTO;
    }

    private Account mapToEnity(AccountDTO accountDTO) {
        Account acc = new Account().builder()
                .id(accountDTO.getId())
                .username(accountDTO.getUsername())
                .name(accountDTO.getName())
                .phone(accountDTO.getPhone())
                .address(accountDTO.getAddress())
                .role(accountDTO.getRole())
                .build();
        return acc;
    }
}
