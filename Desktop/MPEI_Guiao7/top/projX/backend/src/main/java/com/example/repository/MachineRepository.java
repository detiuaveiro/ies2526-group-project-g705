package com.example.repository;

import com.example.domain.Machine;
import com.example.domain.enums.MachineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {
    List<Machine> findByStatus(MachineStatus status);
    List<Machine> findByArchivedAtIsNotNull();
    List<Machine> findByArchivedAtIsNull();
}
