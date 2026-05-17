package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.domain.AssistanceRequest;
import com.example.domain.enums.AssistanceRequestStatus;

public interface AssistanceRequestRepository extends JpaRepository<AssistanceRequest, Long> {

    List<AssistanceRequest> findByStatus(AssistanceRequestStatus status);
    List<AssistanceRequest> findByRequestedById(Long technicianId);
    List<AssistanceRequest> findByAssignedTechnicianId(Long technicianId);
}
