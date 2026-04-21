package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.domain.Admin;


import java.util.UUID;


// <EntityClass, PrimaryKeyType>
public interface AdminRepository extends JpaRepository<Admin, UUID> {
    
}