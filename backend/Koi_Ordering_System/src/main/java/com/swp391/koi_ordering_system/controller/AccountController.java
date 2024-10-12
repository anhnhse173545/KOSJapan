package com.swp391.koi_ordering_system.controller;


import com.swp391.koi_ordering_system.dto.request.CreateAccountDTO;
import com.swp391.koi_ordering_system.dto.response.AccountDTO;
import com.swp391.koi_ordering_system.model.Account;
import com.swp391.koi_ordering_system.service.AccountService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accounts")
public class AccountController {
    @Autowired
    private AccountService accountService;

    @GetMapping("/all")
    public ResponseEntity<List<AccountDTO>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @GetMapping("/{account_id}/detail")
    public ResponseEntity<AccountDTO> getAccountById(@PathVariable String account_id) {
        return ResponseEntity.ok(accountService.getAccountById(account_id));
    }

    @GetMapping("/{role}/all")
    public ResponseEntity<List<AccountDTO>> getAllAccountsByRole(@PathVariable String role) {
        return ResponseEntity.ok(accountService.getAccountByRole(role));
    }

    @PostMapping("/create")
    public ResponseEntity<AccountDTO> createAccount(@RequestBody CreateAccountDTO accountDTO) {
        Account newAccount = accountService.createAccount(accountDTO);
        return ResponseEntity.ok(accountService.mapToDTO(newAccount));
    }

    @PutMapping("/{account_id}/update")
    public ResponseEntity<AccountDTO> updateAccount(@PathVariable String account_id,
                                                    @RequestBody CreateAccountDTO accountDTO) {
        Account updatedAccount = accountService.updateAccount(account_id, accountDTO);
        return ResponseEntity.ok(accountService.mapToDTO(updatedAccount));
    }

    @DeleteMapping("/{account_id}/delete")
    public ResponseEntity<String> deleteAccount(@PathVariable String account_id) {
        accountService.deleteAccount(account_id);
        return ResponseEntity.ok("Account deleted successfully.");
    }

}
