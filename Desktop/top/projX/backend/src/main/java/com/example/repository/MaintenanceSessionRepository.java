package com.example.repository;

import java.util.List;

import com.example.domain.MaintenanceSession;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MaintenanceSessionRepository extends JpaRepository<MaintenanceSession, Long> {

    List<MaintenanceSession> findByTechnicianIdAndActiveTrue(Long technicianId);
}
