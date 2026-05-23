package com.example.service;

import com.example.domain.AssistanceRequest;
import com.example.domain.Maintenance;
import com.example.domain.MaintenanceLog;
import com.example.domain.MaintenanceSession;
import com.example.domain.Problem;
import com.example.domain.Technician;
import com.example.domain.enums.AssistanceRequestStatus;
import com.example.domain.enums.MaintenanceStatus;
import com.example.dto.AssistanceRequestCompleteDTO;
import com.example.dto.AssistanceRequestCreateDTO;
import com.example.dto.AssistanceRequestDTO;
import com.example.repository.AssistanceRequestRepository;
import com.example.repository.MaintenanceLogRepository;
import com.example.repository.MaintenanceRepository;
import com.example.repository.MaintenanceSessionRepository;
import com.example.repository.ProblemRepository;
import com.example.repository.TechnicianRepository;
import com.example.repository.MachineRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

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
    private final MaintenanceLogRepository maintenanceLogRepository;
    private final TechnicianStatsService technicianStatsService;
    private final MachineMetricsService machineMetricsService;

    private static final List<AssistanceRequestStatus> ACTIVE_REQUEST_STATUSES =
            List.of(AssistanceRequestStatus.PENDING, AssistanceRequestStatus.ACCEPTED);

    public AssistanceRequestDTO create(AssistanceRequestCreateDTO dto) {

        Technician requestedBy = technicianRepository.findById(dto.getRequestedById())
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        Problem problem;
        Long machineId;

        if (dto.getProblemId() == null) {

            if (dto.getMachineId() == null) {
                throw new RuntimeException("Machine id is required");
            }
            machineId = dto.getMachineId();

            var machine = machineRepository.findById(machineId)
                    .orElseThrow(() -> new RuntimeException("Machine not found"));

            assertNoActiveRequestForMachine(machineId);

            problem = Problem.builder()
                    .machine(machine)
                    .description("Assistance requested: " + dto.getReason())
                    .priority(1.0)
                    .resolved(false)
                    .startProblemDate(LocalDateTime.now())
                    .build();

            problem = problemRepository.save(problem);

        } else {
            problem = problemRepository.findById(dto.getProblemId())
                    .orElseThrow(() -> new RuntimeException("Problem not found"));
            machineId = problem.getMachine().getId();
            assertNoActiveRequestForMachine(machineId);
        }

        var machine = problem.getMachine();
        assertRequesterOwnsActiveMaintenance(machine, requestedBy);

        AssistanceRequest request = AssistanceRequest.builder()
                .problem(problem)
                .requestedBy(requestedBy)
                .reason(dto.getReason())
                .status(AssistanceRequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        AssistanceRequest saved = assistanceRequestRepository.save(request);
        machineMetricsService.refreshMetrics(machine.getId());
        return assistanceRequestRepository.findByIdWithDetails(saved.getId())
                .map(this::toDTO)
                .orElseGet(() -> toDTO(saved));
    }

    public List<AssistanceRequestDTO> getAll() {
        return assistanceRequestRepository.findAllWithDetails()
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
            case "DIRECTOR", "ADMIN" -> assistanceRequestRepository.findAllWithDetails()
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

    @Transactional(readOnly = true)
    public List<AssistanceRequestDTO> getActiveForMachine(Long machineId) {
        return assistanceRequestRepository.findActiveForMachineWithDetails(machineId, ACTIVE_REQUEST_STATUSES)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public AssistanceRequestDTO assign(Long requestId, Long technicianId) {

        AssistanceRequest request = assistanceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() == AssistanceRequestStatus.COMPLETED) {
            throw new RuntimeException("Cannot assign a completed request");
        }

        Technician tech = technicianRepository.findById(technicianId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        if (Objects.equals(request.getRequestedBy().getId(), technicianId)) {
            throw new RuntimeException("Cannot assign the request to the technician who created it");
        }

        if (request.getAssignedTechnician() != null) {
            if (Objects.equals(request.getAssignedTechnician().getId(), technicianId)) {
                return toDTO(request);
            }
            throw new RuntimeException(
                    "This request already has an assigned technician. Remove the assignment before assigning another.");
        }

        var machine = request.getProblem().getMachine();

        if (machine.getAssignedTechnicians().stream().anyMatch(t -> t.getId().equals(technicianId))) {
            throw new RuntimeException(
                    "Cannot assign assistance to a technician already assigned to this machine. Choose an external technician.");
        }

        // When a director assigns an assistance request to a new technician,
        // persist that technician in the machine assignment list as well.
        machine.getAssignedTechnicians().add(tech);
        machineRepository.saveAndFlush(machine);

        request.setAssignedTechnician(tech);
        request.setStatus(AssistanceRequestStatus.ACCEPTED);
        request.setAcceptedAt(LocalDateTime.now());
        assistanceRequestRepository.saveAndFlush(request);

        technicianStatsService.markBusy(tech, machine);
        technicianRepository.saveAndFlush(tech);

        return toDTO(assistanceRequestRepository.findById(requestId).orElseThrow());
    }

    public AssistanceRequestDTO unassign(Long requestId) {

        AssistanceRequest request = assistanceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getAssignedTechnician() == null) {
            throw new RuntimeException("No technician is assigned to this request");
        }

        if (request.getStatus() == AssistanceRequestStatus.COMPLETED) {
            throw new RuntimeException("Cannot unassign a completed request");
        }

        Technician tech = request.getAssignedTechnician();
        technicianStatsService.releaseFromAssistanceAssignment(tech);
        technicianRepository.save(tech);

        request.setAssignedTechnician(null);
        request.setStatus(AssistanceRequestStatus.PENDING);
        request.setAcceptedAt(null);

        return toDTO(assistanceRequestRepository.save(request));
    }

    public AssistanceRequestDTO complete(Long requestId, AssistanceRequestCompleteDTO dto) {

        AssistanceRequest request = assistanceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() == AssistanceRequestStatus.COMPLETED) {
            return toDTO(request);
        }

        Problem problem = request.getProblem();
        var machine = problem.getMachine();
        Technician assistant = request.getAssignedTechnician();
        Technician requester = request.getRequestedBy();

        double assistantHours = resolveHours(dto, request.getAcceptedAt());

        if (dto != null && dto.hasLogData() && assistant != null) {
            saveAssistanceLog(machine, assistant, dto);
        }

        var techniciansReleased = closeActiveSessionsOnMachine(machine);

        maintenanceRepository.findByMachineIdAndStatus(machine.getId(), MaintenanceStatus.IN_PROGRESS)
                .forEach(m -> {
                    m.setStatus(MaintenanceStatus.COMPLETED);
                    maintenanceRepository.save(m);
                });

        resolveAllOpenProblemsOnMachine(machine);

        machine.setStatus(com.example.domain.enums.MachineStatus.ACTIVE);
        machineRepository.save(machine);
        machineMetricsService.refreshMetrics(machine.getId());

        if (requester != null && !techniciansReleased.contains(requester.getId())) {
            technicianStatsService.releaseFromMachineWork(requester, true);
            requester.setWasAssistedCounter(requester.getWasAssistedCounter() + 1);
            technicianRepository.save(requester);
        } else if (requester != null) {
            requester.setWasAssistedCounter(requester.getWasAssistedCounter() + 1);
            technicianRepository.save(requester);
        }

        if (assistant != null) {
            if (!techniciansReleased.contains(assistant.getId())) {
                technicianStatsService.releaseFromMachineWork(assistant, true);
            }
            technicianStatsService.recordAssistanceCompletion(assistant, assistantHours);
            technicianRepository.save(assistant);
        }

        request.setStatus(AssistanceRequestStatus.COMPLETED);
        request.setCompletedAt(LocalDateTime.now());

        return toDTO(assistanceRequestRepository.save(request));
    }

    private void assertRequesterOwnsActiveMaintenance(com.example.domain.Machine machine, Technician requestedBy) {
        if (machine.getStatus() != com.example.domain.enums.MachineStatus.MAINTENANCE) {
            throw new RuntimeException("Assistance can only be requested during active maintenance on this machine");
        }
        var activeSessions = maintenanceSessionRepository.findByMachineIdAndActiveTrue(machine.getId());
        if (activeSessions.isEmpty()) {
            throw new RuntimeException("No active maintenance session found for this machine");
        }
        Long ownerId = activeSessions.get(0).getTechnician().getId();
        if (!ownerId.equals(requestedBy.getId())) {
            throw new RuntimeException("Only the technician who started maintenance can request assistance");
        }
    }

    private Set<Long> closeActiveSessionsOnMachine(com.example.domain.Machine machine) {
        Set<Long> releasedTechnicianIds = new HashSet<>();
        for (MaintenanceSession session : maintenanceSessionRepository.findByMachineIdAndActiveTrue(machine.getId())) {
            session.setActive(false);
            session.setEndTime(LocalDateTime.now());
            if (session.getMaintenanceRecord() != null) {
                Maintenance record = session.getMaintenanceRecord();
                record.setStatus(MaintenanceStatus.COMPLETED);
                maintenanceRepository.save(record);
            }
            maintenanceSessionRepository.save(session);

            Technician tech = session.getTechnician();
            if (tech != null && releasedTechnicianIds.add(tech.getId())) {
                technicianStatsService.releaseFromMachineWork(tech, true);
                technicianRepository.save(tech);
            }
        }
        return releasedTechnicianIds;
    }

    private void resolveAllOpenProblemsOnMachine(com.example.domain.Machine machine) {
        LocalDateTime now = LocalDateTime.now();
        for (Problem open : problemRepository.findByMachineIdAndResolvedFalse(machine.getId())) {
            open.setResolved(true);
            open.setSolvedProblemDate(now);
            problemRepository.save(open);
        }
    }

    private void saveAssistanceLog(com.example.domain.Machine machine, Technician assistant, AssistanceRequestCompleteDTO dto) {
        maintenanceRepository.findByMachineIdAndStatus(machine.getId(), MaintenanceStatus.IN_PROGRESS)
                .stream()
                .filter(m -> m.getType().isOriginal())
                .findFirst()
                .or(() -> maintenanceRepository.findByMachineIdAndStatus(machine.getId(), MaintenanceStatus.COMPLETED)
                        .stream()
                        .filter(m -> m.getType().isOriginal())
                        .findFirst())
                .ifPresent(maintenance -> {
                    MaintenanceLog log = MaintenanceLog.builder()
                            .maintenance(maintenance)
                            .technician(assistant)
                            .title(dto.getTitle())
                            .description(dto.getDescription())
                            .hoursSpent(dto.getHoursSpent())
                            .partsUsed(dto.getPartsUsed())
                            .build();
                    maintenanceLogRepository.save(log);
                });
    }

    private double resolveHours(AssistanceRequestCompleteDTO dto, LocalDateTime acceptedAt) {
        if (dto != null && dto.getHoursSpent() != null && dto.getHoursSpent() > 0) {
            return dto.getHoursSpent();
        }
        if (acceptedAt != null) {
            return Math.max(0.1, ChronoUnit.MINUTES.between(acceptedAt, LocalDateTime.now()) / 60.0);
        }
        return 0.1;
    }

    private void assertNoActiveRequestForMachine(Long machineId) {
        if (assistanceRequestRepository.existsByProblemMachineIdAndStatusIn(machineId, ACTIVE_REQUEST_STATUSES)) {
            throw new RuntimeException("This machine already has an active assistance request");
        }
    }

    private AssistanceRequestDTO toDTO(AssistanceRequest r) {
        AssistanceRequestDTO dto = new AssistanceRequestDTO();
        dto.setId(r.getId());
        dto.setProblemId(r.getProblem().getId());
        dto.setProblemDescription(r.getProblem().getDescription());
        dto.setMachineId(r.getProblem().getMachine().getId());
        dto.setMachineName(r.getProblem().getMachine().getName());
        dto.setMachineLocation(r.getProblem().getMachine().getLocation());
        dto.setMachineAssignedTechnicianIds(
                r.getProblem().getMachine().getAssignedTechnicians().stream()
                        .map(Technician::getId)
                        .toList()
        );
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
