package com.vikas.dWallet.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vikas.dWallet.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
