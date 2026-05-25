package com.example.repository;

import com.example.domain.MaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Long> {

    @Query("SELECT COALESCE(SUM(l.hoursSpent), 0) FROM MaintenanceLog l WHERE l.maintenance.machine.id = :machineId")
    Double sumHoursSpentByMachineId(@Param("machineId") Long machineId);

    List<MaintenanceLog> findByMaintenanceIdOrderByCreatedAtDesc(Long maintenanceId);

    List<MaintenanceLog> findByTechnicianId(Long technicianId);

    List<MaintenanceLog> findByMaintenanceMachineIdOrderByCreatedAtDesc(Long machineId);
}
