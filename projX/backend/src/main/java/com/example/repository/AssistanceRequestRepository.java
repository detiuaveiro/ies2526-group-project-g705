package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.domain.AssistanceRequest;
import com.example.domain.enums.AssistanceRequestStatus;

public interface AssistanceRequestRepository extends JpaRepository<AssistanceRequest, Long> {

    List<AssistanceRequest> findByStatus(AssistanceRequestStatus status);
    List<AssistanceRequest> findByRequestedById(Long technicianId);

    @Query("""
            SELECT ar FROM AssistanceRequest ar
            JOIN FETCH ar.problem p
            JOIN FETCH p.machine
            JOIN FETCH ar.requestedBy
            JOIN FETCH ar.assignedTechnician
            WHERE ar.assignedTechnician.id = :technicianId
            """)
    List<AssistanceRequest> findAllAssignedToTechnician(@Param("technicianId") Long technicianId);
    List<AssistanceRequest> findByProblemMachineIdAndStatusIn(
            Long machineId,
            List<AssistanceRequestStatus> statuses
    );
}
