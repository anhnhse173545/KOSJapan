package com.swp391.koi_ordering_system.controller;

import com.swp391.koi_ordering_system.dto.AccountDTO;
import com.swp391.koi_ordering_system.model.Account;
import com.swp391.koi_ordering_system.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accounts")
public class AccountController {
    private AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/all")
    public List<AccountDTO> getAllAccounts() {
        return accountService.getAllAccounts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountDTO> accountDetail(@PathVariable String id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    @PostMapping("/create-new-account")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Account> createNewAccount(@RequestBody Account account) {
        return new ResponseEntity<>(accountService.createNewAccount(account), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/update-account")
    public ResponseEntity<Account> updateAccount(@PathVariable String id, @RequestBody Account account) {
        Account updatedAcc = accountService.updateAccount(id, account);
        return new ResponseEntity<>(updatedAcc, HttpStatus.OK);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<String> deleteAccount(@PathVariable String id) {
        accountService.deleteAccount(id);
        return new ResponseEntity<>("Account deleted", HttpStatus.OK);
    }

}
