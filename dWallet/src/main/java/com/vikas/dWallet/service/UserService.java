package com.vikas.dWallet.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.vikas.dWallet.model.Transaction;
import com.vikas.dWallet.model.User;
import com.vikas.dWallet.model.Wallet;
import com.vikas.dWallet.repository.TransactionRepository;
import com.vikas.dWallet.repository.UserRepository;
import com.vikas.dWallet.repository.WalletRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerNewUser(String username, String rawPassword) {
        String hashedPassword = passwordEncoder.encode(rawPassword);

        User user = new User();
        user.setUsername(username);
        user.setPassword(hashedPassword);

        // Save user
        user = userRepository.save(user);

        // Create wallet for user, starting with 500
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        wallet.setBalance(new java.math.BigDecimal("500"));

        walletRepository.save(wallet);

        // Optionally, log initial credit transaction
        Transaction tx = new Transaction();
        tx.setWallet(wallet);
        tx.setAmount(new java.math.BigDecimal("500"));
        tx.setType("CREDIT");
        tx.setDescription("Welcome bonus");
        transactionRepository.save(tx);

        return user;
    }

    public User authenticateUser(String username, String rawPassword) {
        Optional<User> existing = userRepository.findByUsername(username);
        if (existing.isPresent() && passwordEncoder.matches(rawPassword, existing.get().getPassword())) {
            return existing.get();
        }
        return null;
    }

}
