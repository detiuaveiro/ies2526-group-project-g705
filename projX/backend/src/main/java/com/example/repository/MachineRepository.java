package com.example.repository;

import com.example.domain.Machine;
import com.example.domain.enums.MachineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {
    List<Machine> findByStatus(MachineStatus status);

    @Query("SELECT COUNT(m) FROM Machine m")
    long countNonArchived();

    @Query("""
            SELECT COUNT(m) FROM Machine m
            WHERE m.status = com.example.domain.enums.MachineStatus.MAINTENANCE
            """)
    long countInMaintenance();

    @Query("""
            SELECT COUNT(m) FROM Machine m
            WHERE m.suspicionFlag = true
              AND m.status <> com.example.domain.enums.MachineStatus.MAINTENANCE
            """)
    long countSuspiciousNotInMaintenance();

    @Query("""
            SELECT COUNT(m) FROM Machine m
            WHERE m.suspicionFlag = false
              AND m.status <> com.example.domain.enums.MachineStatus.MAINTENANCE
            """)
    long countNormalNotInMaintenance();
}
