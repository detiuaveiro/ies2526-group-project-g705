package com.example.repository;

import com.example.domain.MaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Long> {

    List<MaintenanceLog> findByMaintenanceIdOrderByCreatedAtDesc(Long maintenanceId);

    List<MaintenanceLog> findByTechnicianId(Long technicianId);

    List<MaintenanceLog> findByMaintenanceMachineIdOrderByCreatedAtDesc(Long machineId);
}
