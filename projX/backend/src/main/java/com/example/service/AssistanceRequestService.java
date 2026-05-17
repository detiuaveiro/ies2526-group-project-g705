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

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AssistanceRequestService {

    private final AssistanceRequestRepository assistanceRequestRepository;
    private final ProblemRepository problemRepository;
    private final TechnicianRepository technicianRepository;
    private final MachineRepository machineRepository;

    private final MaintenanceRepository maintenanceRepository;
    private final MaintenanceSessionRepository maintenanceSessionRepository;

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

        // Logic: if machine is in maintenance, only the original tech can request assistance
        var machine = problem.getMachine();
        if (machine.getStatus() == com.example.domain.enums.MachineStatus.MAINTENANCE) {
            var originalMaintenance = maintenanceRepository.findByMachineIdAndStatus(machine.getId(), MaintenanceStatus.IN_PROGRESS)
                    .stream()
                    .filter(m -> m.getType() == MaintenanceType.ORIGINAL)
                    .findFirst();

            if (originalMaintenance.isPresent() && !originalMaintenance.get().getTechnician().getId().equals(requestedBy.getId())) {
                throw new RuntimeException("Only the technician responsible for the original maintenance can request assistance.");
            }
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

    @Transactional(readOnly = true)
    public List<AssistanceRequestDTO> getForRole(String role, Long userId) {
        if (role == null) {
            return List.of();
        }
        return switch (role.toUpperCase()) {
            case "DIRECTOR", "ADMIN" -> assistanceRequestRepository.findAll()
                    .stream()
                    .map(this::toDTO)
                    .toList();
            case "TECHNICIAN" -> {
                if (userId == null) {
                    yield List.of();
                }
                yield assistanceRequestRepository.findAllAssignedToTechnician(userId)
                        .stream()
                        .filter(r -> !Objects.equals(r.getRequestedBy().getId(), userId))
                        .map(this::toDTO)
                        .toList();
            }
            default -> List.of();
        };
    }

    @Transactional(readOnly = true)
    public List<AssistanceRequestDTO> getForAuthenticatedUser() {
        return List.of();
    }

    public AssistanceRequestDTO assign(Long requestId, Long technicianId) {

        AssistanceRequest request = assistanceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        Technician tech = technicianRepository.findById(technicianId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        if (Objects.equals(request.getRequestedBy().getId(), technicianId)) {
            throw new RuntimeException("Cannot assign the request to the technician who created it");
        }

        var machine = request.getProblem().getMachine();

        if (machine.getAssignedTechnicians().stream().noneMatch(t -> t.getId().equals(tech.getId()))) {
            machine.getAssignedTechnicians().add(tech);
            machineRepository.save(machine);
        }

        request.setAssignedTechnician(tech);
        request.setStatus(AssistanceRequestStatus.ACCEPTED);
        request.setAcceptedAt(LocalDateTime.now());
        assistanceRequestRepository.saveAndFlush(request);

        tech.setAvailable(false);
        tech.setTasksPending(tech.getTasksPending() + 1);
        tech.setCurrentAssignment(machine);
        technicianRepository.saveAndFlush(tech);

        if (machine.getStatus() != com.example.domain.enums.MachineStatus.MAINTENANCE) {
            machine.setStatus(com.example.domain.enums.MachineStatus.MAINTENANCE);
        }
        machineRepository.save(machine);

        try {
            Maintenance maintenance = Maintenance.builder()
                    .machine(machine)
                    .technician(tech)
                    .type(MaintenanceType.ASSISTANCE)
                    .status(MaintenanceStatus.IN_PROGRESS)
                    .notes("Maintenance started automatically from assistance request")
                    .build();
            maintenance = maintenanceRepository.save(maintenance);

            MaintenanceSession session = MaintenanceSession.builder()
                    .technician(tech)
                    .machine(machine)
                    .request(request)
                    .maintenanceRecord(maintenance)
                    .startTime(LocalDateTime.now())
                    .active(true)
                    .build();
            maintenanceSessionRepository.save(session);
        } catch (Exception e) {
            log.warn("Assistance assigned to technician {} but maintenance session was not started: {}",
                    technicianId, e.getMessage());
        }

        return toDTO(assistanceRequestRepository.findById(requestId).orElseThrow());
    }

        public AssistanceRequestDTO complete(Long requestId) {

        AssistanceRequest request = assistanceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

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
                
                if (s.getMaintenanceRecord() != null) {
                    Maintenance m = s.getMaintenanceRecord();
                    m.setStatus(MaintenanceStatus.COMPLETED);
                    maintenanceRepository.save(m);
                }
                
                maintenanceSessionRepository.save(s);
            }

            tech.setAvailable(true);
            tech.setCurrentAssignment(null);
            tech.setTasksCompleted(tech.getTasksCompleted() + 1);
            tech.setTasksPending(Math.max(0, tech.getTasksPending() - 1));
            technicianRepository.save(tech);
        }

        return toDTO(assistanceRequestRepository.save(request));
    }



    private AssistanceRequestDTO toDTO(AssistanceRequest r) {
        AssistanceRequestDTO dto = new AssistanceRequestDTO();
        dto.setId(r.getId());
        dto.setProblemId(r.getProblem().getId());
        dto.setProblemDescription(r.getProblem().getDescription());
        dto.setMachineId(r.getProblem().getMachine().getId());
        dto.setMachineName(r.getProblem().getMachine().getName());
        dto.setMachineLocation(r.getProblem().getMachine().getLocation());
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
