package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.domain.MaintenanceTechnician;



import java.util.UUID;



// <EntityClass, PrimaryKeyType>
public interface MaintenanceTechnicianRepository extends JpaRepository<MaintenanceTechnician, UUID> {
    
}