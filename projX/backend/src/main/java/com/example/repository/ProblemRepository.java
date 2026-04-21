package com.example.repository;

import com.example.domain.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByMachineId(Long machineId);
    List<Problem> findByResolved(boolean resolved);
    List<Problem> findByAssignedTechnicianId(Long technicianId);
}
