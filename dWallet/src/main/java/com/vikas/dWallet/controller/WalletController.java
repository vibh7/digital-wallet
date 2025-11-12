package com.vikas.dWallet.controller;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vikas.dWallet.dto.DepositRequest;
import com.vikas.dWallet.dto.TransactionDTO;
import com.vikas.dWallet.dto.TransferRequest;
import com.vikas.dWallet.dto.WithdrawRequest;
import com.vikas.dWallet.model.Transaction;
import com.vikas.dWallet.model.User;
import com.vikas.dWallet.model.Wallet;
import com.vikas.dWallet.repository.TransactionRepository;
import com.vikas.dWallet.repository.UserRepository;
import com.vikas.dWallet.repository.WalletRepository;
import com.vikas.dWallet.util.JwtUtil;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {
    @Autowired private UserRepository userRepository;
    @Autowired private WalletRepository walletRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private JwtUtil jwtUtil;

    @GetMapping("/balance")
    public ResponseEntity<?> getBalance(Principal principal) {
        String username = principal.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        Wallet wallet = walletRepository.findByUser(user);
        if (wallet == null) return ResponseEntity.status(404).body("Wallet not found");

        return ResponseEntity.ok(wallet.getBalance());
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody TransferRequest request, Principal principal) {
        String fromUsername = principal.getName();
        String toUsername = request.getToUsername();
        BigDecimal amount = request.getAmount();

        if (fromUsername.equals(toUsername)) {
            return ResponseEntity.badRequest().body("Cannot transfer to self");
        }

        User fromUser = userRepository.findByUsername(fromUsername).orElse(null);
        User toUser = userRepository.findByUsername(toUsername).orElse(null);
        if (fromUser == null || toUser == null) return ResponseEntity.status(404).body("User not found");

        Wallet fromWallet = walletRepository.findByUser(fromUser);
        Wallet toWallet = walletRepository.findByUser(toUser);

        if (fromWallet.getBalance().compareTo(amount) < 0) {
            return ResponseEntity.badRequest().body("Insufficient balance");
        }

        fromWallet.setBalance(fromWallet.getBalance().subtract(amount));
        toWallet.setBalance(toWallet.getBalance().add(amount));
        walletRepository.save(fromWallet);
        walletRepository.save(toWallet);

        Transaction debit = new Transaction();
        debit.setWallet(fromWallet);
        debit.setAmount(amount);
        debit.setType("DEBIT");
        debit.setDescription("Transfer to " + toUsername);
        transactionRepository.save(debit);

        Transaction credit = new Transaction();
        credit.setWallet(toWallet);
        credit.setAmount(amount);
        credit.setType("CREDIT");
        credit.setDescription("Received from " + fromUsername);
        transactionRepository.save(credit);

        return ResponseEntity.ok("Transferred " + amount + " to " + toUsername);
    }

    // Get transaction history (fix here!)
    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions(Principal principal) {
        String username = principal.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        Wallet wallet = walletRepository.findByUser(user);
        List<Transaction> txList = transactionRepository.findByWallet(wallet);

        List<TransactionDTO> dtoList = txList.stream()
            .map(tx -> new TransactionDTO(tx.getId(), tx.getAmount(), tx.getType(), tx.getDescription(), tx.getTimestamp()))
            .toList();

        return ResponseEntity.ok(dtoList);
    }

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody DepositRequest request, Principal principal) {
        String username = principal.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        Wallet wallet = walletRepository.findByUser(user);
        BigDecimal amount = request.getAmount();

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body("Deposit amount must be greater than zero");
        }

        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        Transaction tx = new Transaction();
        tx.setWallet(wallet);
        tx.setAmount(amount);
        tx.setType("CREDIT");
        tx.setDescription("Deposit");
        transactionRepository.save(tx);

        return ResponseEntity.ok("Successfully deposited " + amount);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody WithdrawRequest request, Principal principal) {
        String username = principal.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        Wallet wallet = walletRepository.findByUser(user);
        BigDecimal amount = request.getAmount();

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body("Withdraw amount must be greater than zero");
        }
        if (wallet.getBalance().compareTo(amount) < 0) {
            return ResponseEntity.badRequest().body("Insufficient balance");
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);

        Transaction tx = new Transaction();
        tx.setWallet(wallet);
        tx.setAmount(amount);
        tx.setType("DEBIT");
        tx.setDescription("Withdraw");
        transactionRepository.save(tx);

        return ResponseEntity.ok("Successfully withdrew " + amount);
    }
}
