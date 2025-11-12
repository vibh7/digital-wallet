package com.vikas.dWallet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vikas.dWallet.model.Transaction;
import com.vikas.dWallet.model.Wallet;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByWallet(Wallet wallet);
}
