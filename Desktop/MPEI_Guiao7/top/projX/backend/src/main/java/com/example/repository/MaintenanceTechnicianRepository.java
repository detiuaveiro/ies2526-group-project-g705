package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.domain.MaintenanceTechnician;


public interface MaintenanceTechnicianRepository extends JpaRepository<MaintenanceTechnician, Long> {
    
}