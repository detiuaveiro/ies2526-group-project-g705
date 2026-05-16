package com.example.service;

import com.example.domain.AssistanceRequest;
import com.example.domain.Maintenance;
import com.example.domain.MaintenanceSession;
import com.example.domain.Problem;
import com.example.domain.Technician;
import com.example.domain.enums.AssistanceRequestStatus;
import com.example.domain.enums.MaintenanceStatus;
import com.example.domain.enums.MaintenanceType;
import com.example.dto.AssistanceRequestCreateDTO;
import com.example.dto.AssistanceRequestDTO;
import com.example.repository.AssistanceRequestRepository;
import com.example.repository.MaintenanceRepository;
import com.example.repository.MaintenanceSessionRepository;
import com.example.repository.ProblemRepository;
import com.example.repository.TechnicianRepository;
import com.example.repository.MachineRepository;
import com.example.repository.UserRepository;
import com.example.domain.User;
import com.example.domain.enums.UserRole;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AssistanceRequestService {

    private final AssistanceRequestRepository assistanceRequestRepository;
    private final ProblemRepository problemRepository;
    private final TechnicianRepository technicianRepository;
    private final MachineRepository machineRepository;

    private final MaintenanceRepository maintenanceRepository;
    private final MaintenanceSessionRepository maintenanceSessionRepository;
    private final UserRepository userRepository;

    public AssistanceRequestDTO create(AssistanceRequestCreateDTO dto) {

        Technician requestedBy = technicianRepository.findById(dto.getRequestedById())
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        Problem problem;

        if (dto.getProblemId() == null) {

            var machine = machineRepository.findById(dto.getMachineId())
                    .orElseThrow(() -> new RuntimeException("Machine not found"));

            problem = Problem.builder()
                    .machine(machine)
                    .description("Assistance requested: " + dto.getReason())
                    .priority(1.0)
                    .resolved(false)
                    .startProblemDate(LocalDateTime.now())
                    .build();

            problem = problemRepository.save(problem);

            machine.setActionRequiredCount(machine.getActionRequiredCount() + 1);
            machine.setAssistanceRequestedCount(machine.getAssistanceRequestedCount() + 1);
            machineRepository.save(machine);

        } else {
            problem = problemRepository.findById(dto.getProblemId())
                    .orElseThrow(() -> new RuntimeException("Problem not found"));
        }

        AssistanceRequest request = AssistanceRequest.builder()
                .problem(problem)
                .requestedBy(requestedBy)
                .reason(dto.getReason())
                .status(AssistanceRequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        return toDTO(assistanceRequestRepository.save(request));
    }

    public List<AssistanceRequestDTO> getAll() {
        return assistanceRequestRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<AssistanceRequestDTO> getForAuthenticatedUser() {
        User current = getCurrentUser();
        return getForRole(current.getRole().name(), current.getId());
    }

    public List<AssistanceRequestDTO> getForRole(String role, Long userId) {
        if ("TECHNICIAN".equalsIgnoreCase(role) && userId != null) {
            return assistanceRequestRepository.findByAssignedTechnicianId(userId)
                    .stream()
                    .filter(r -> r.getStatus() != AssistanceRequestStatus.COMPLETED)
                    .map(this::toDTO)
                    .toList();
        }
        if ("DIRECTOR".equalsIgnoreCase(role) || "ADMIN".equalsIgnoreCase(role)) {
            return getAll();
        }
        return List.of();
    }

    public AssistanceRequestDTO assign(Long requestId, Long technicianId) {
        User current = getCurrentUser();
        if (current.getRole() != UserRole.DIRECTOR && current.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Only directors can assign assistance requests");
        }

        AssistanceRequest request = assistanceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getRequestedBy().getId().equals(technicianId)) {
            throw new RuntimeException("Cannot assign the request to the technician who created it");
        }

        Technician tech = technicianRepository.findById(technicianId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        var machine = request.getProblem().getMachine();

        request.setAssignedTechnician(tech);
        request.setStatus(AssistanceRequestStatus.ACCEPTED);
        request.setAcceptedAt(LocalDateTime.now());

        Maintenance maintenance = Maintenance.builder()
                .machine(machine)
                .technician(tech)
                .type(MaintenanceType.NORMAL)
                .status(MaintenanceStatus.IN_PROGRESS)
                .notes("Maintenance started automatically from assistance request")
                .build();

        maintenance = maintenanceRepository.save(maintenance);

        MaintenanceSession session = MaintenanceSession.builder()
                .technician(tech)
                .machine(machine)
                .request(request)
                .startTime(LocalDateTime.now())
                .active(true)
                .build();

        maintenanceSessionRepository.save(session);

        tech.setAvailable(false);
        tech.setCurrentAssignment(machine);
        technicianRepository.save(tech);

        machine.setStatus(com.example.domain.enums.MachineStatus.MAINTENANCE);
        machineRepository.save(machine);

        return toDTO(assistanceRequestRepository.save(request));
    }

    public AssistanceRequestDTO complete(Long requestId) {
        User current = getCurrentUser();

        AssistanceRequest request = assistanceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getAssignedTechnician() == null) {
            throw new RuntimeException("Request has no assigned technician");
        }

        boolean isDirector = current.getRole() == UserRole.DIRECTOR || current.getRole() == UserRole.ADMIN;
        boolean isAssignedTechnician = request.getAssignedTechnician().getId().equals(current.getId());
        if (!isDirector && !isAssignedTechnician) {
            throw new RuntimeException("Only the assigned technician or a director can complete this request");
        }

        request.setStatus(AssistanceRequestStatus.COMPLETED);
        request.setCompletedAt(LocalDateTime.now());

        Problem problem = request.getProblem();
        problem.setResolved(true);
        problemRepository.save(problem);

        var machine = problem.getMachine();
        machine.setActionRequiredCount(Math.max(0, machine.getActionRequiredCount() - 1));
        machine.setStatus(com.example.domain.enums.MachineStatus.ACTIVE);
        machineRepository.save(machine);

        Technician tech = request.getAssignedTechnician();

        if (tech != null) {

            var sessions = maintenanceSessionRepository.findByTechnicianIdAndActiveTrue(tech.getId());

            for (MaintenanceSession s : sessions) {
                s.setActive(false);
                s.setEndTime(LocalDateTime.now());
                maintenanceSessionRepository.save(s);
            }

            tech.setAvailable(true);
            tech.setCurrentAssignment(null);
            tech.setTasksCompleted(tech.getTasksCompleted() + 1);
            technicianRepository.save(tech);
        }

        return toDTO(assistanceRequestRepository.save(request));
    }



    private User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName() == null) {
            throw new RuntimeException("Unauthorized");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private AssistanceRequestDTO toDTO(AssistanceRequest r) {
        AssistanceRequestDTO dto = new AssistanceRequestDTO();
        dto.setId(r.getId());
        dto.setProblemId(r.getProblem().getId());
        dto.setProblemDescription(r.getProblem().getDescription());
        var machine = r.getProblem().getMachine();
        dto.setMachineId(machine.getId());
        dto.setMachineName(machine.getName());
        dto.setMachineLocation(machine.getLocation());
        dto.setRequestedById(r.getRequestedBy().getId());
        dto.setRequestedByName(r.getRequestedBy().getName());
        if (r.getAssignedTechnician() != null) {
            dto.setAssignedTechnicianId(r.getAssignedTechnician().getId());
            dto.setAssignedTechnicianName(r.getAssignedTechnician().getName());
        }
        dto.setReason(r.getReason());
        dto.setStatus(r.getStatus());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setAcceptedAt(r.getAcceptedAt());
        dto.setCompletedAt(r.getCompletedAt());
        return dto;
    }

}
