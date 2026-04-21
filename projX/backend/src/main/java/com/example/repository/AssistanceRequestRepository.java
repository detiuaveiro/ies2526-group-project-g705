package com.example.repository;

import com.example.domain.AssistanceRequest;
import com.example.domain.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssistanceRequestRepository extends JpaRepository<AssistanceRequest, Long> {
    List<AssistanceRequest> findByRequestedById(Long technicianId);
    List<AssistanceRequest> findByStatus(RequestStatus status);
    List<AssistanceRequest> findByAssignedTechnicianId(Long technicianId);
}
