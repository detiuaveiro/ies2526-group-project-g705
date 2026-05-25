package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

import com.example.domain.AssistanceRequest;
import com.example.domain.enums.AssistanceRequestStatus;

public interface AssistanceRequestRepository extends JpaRepository<AssistanceRequest, Long> {

    @Query("""
            SELECT ar FROM AssistanceRequest ar
            JOIN FETCH ar.problem p
            JOIN FETCH p.machine
            JOIN FETCH ar.requestedBy
            LEFT JOIN FETCH ar.assignedTechnician
            """)
    List<AssistanceRequest> findAllWithDetails();

    @Query("""
            SELECT ar FROM AssistanceRequest ar
            JOIN FETCH ar.problem p
            JOIN FETCH p.machine
            JOIN FETCH ar.requestedBy
            LEFT JOIN FETCH ar.assignedTechnician
            WHERE ar.id = :id
            """)
    Optional<AssistanceRequest> findByIdWithDetails(@Param("id") Long id);

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

    List<AssistanceRequest> findByAssignedTechnicianIdAndStatus(
            Long technicianId,
            AssistanceRequestStatus status
    );

    boolean existsByProblemMachineIdAndStatusIn(
            Long machineId,
            List<AssistanceRequestStatus> statuses
    );

    long countByProblemMachineIdAndStatusIn(
            Long machineId,
            List<AssistanceRequestStatus> statuses
    );

    @Query("""
            SELECT ar FROM AssistanceRequest ar
            JOIN FETCH ar.problem p
            JOIN FETCH p.machine
            JOIN FETCH ar.requestedBy
            LEFT JOIN FETCH ar.assignedTechnician
            WHERE p.machine.id = :machineId AND ar.status IN :statuses
            """)
    List<AssistanceRequest> findActiveForMachineWithDetails(
            @Param("machineId") Long machineId,
            @Param("statuses") List<AssistanceRequestStatus> statuses
    );
}
