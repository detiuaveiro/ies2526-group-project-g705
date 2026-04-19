package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.domain.User;


import java.util.UUID;


// <EntityClass, PrimaryKeyType>
public interface UserRepository extends JpaRepository<User, UUID> {
    
}