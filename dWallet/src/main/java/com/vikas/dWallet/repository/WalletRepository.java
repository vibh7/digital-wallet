package com.vikas.dWallet.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vikas.dWallet.model.User;
import com.vikas.dWallet.model.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Wallet findByUser(User user);
}
