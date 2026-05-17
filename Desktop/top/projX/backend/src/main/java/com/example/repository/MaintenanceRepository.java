package com.example.repository;

import com.example.domain.Maintenance;
import com.example.domain.enums.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByMachineId(Long machineId);
    List<Maintenance> findByTechnicianId(Long technicianId);
    List<Maintenance> findByStatus(MaintenanceStatus status);
}
