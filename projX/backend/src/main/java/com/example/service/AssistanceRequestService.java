package com.example.service;

import com.example.domain.AssistanceRequest;
import com.example.domain.Technician;
import com.example.domain.enums.RequestStatus;
import com.example.dto.AssistanceRequestDTO;
import com.example.repository.AssistanceRequestRepository;
import com.example.repository.ProblemRepository;
import com.example.repository.TechnicianRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AssistanceRequestService {

    private final AssistanceRequestRepository requestRepository;
    private final ProblemRepository problemRepository;
    private final TechnicianRepository technicianRepository;

    @Transactional(readOnly = true)
    public List<AssistanceRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    @Transactional(readOnly = true)
    public AssistanceRequest getRequestById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Request not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<AssistanceRequest> getRequestsByTechnician(Long technicianId) {
        return requestRepository.findByRequestedById(technicianId);
    }

    public AssistanceRequest createRequest(AssistanceRequestDTO dto) {
        var problem = problemRepository.findById(dto.getProblemId())
                .orElseThrow(() -> new EntityNotFoundException("Problem not found with id: " + dto.getProblemId()));
        var requestedBy = technicianRepository.findById(dto.getRequestedById())
                .orElseThrow(() -> new EntityNotFoundException("Technician not found with id: " + dto.getRequestedById()));

        AssistanceRequest request = AssistanceRequest.builder()
                .problem(problem)
                .requestedBy(requestedBy)
                .reason(dto.getReason())
                .status(RequestStatus.PENDING)
                .build();

        return requestRepository.save(request);
    }

    public AssistanceRequest updateRequest(Long id, AssistanceRequestDTO dto) {
        AssistanceRequest request = getRequestById(id);
        request.setReason(dto.getReason());
        if (dto.getStatus() != null) {
            request.setStatus(dto.getStatus());
        }
        return requestRepository.save(request);
    }

    /** Accepts a request and assigns the responding technician */
    public AssistanceRequest acceptRequest(Long requestId, Long technicianId) {
        AssistanceRequest request = getRequestById(requestId);
        Technician tech = technicianRepository.findById(technicianId)
                .orElseThrow(() -> new EntityNotFoundException("Technician not found with id: " + technicianId));
        request.setAssignedTechnician(tech);
        request.setStatus(RequestStatus.ACCEPTED);
        return requestRepository.save(request);
    }

    public void deleteRequest(Long id) {
        requestRepository.delete(getRequestById(id));
    }
}
