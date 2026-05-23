package com.example.controller;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.domain.Machine;
import com.example.domain.Maintenance;
import com.example.domain.MaintenanceSession;
import com.example.domain.Technician;
import com.example.domain.enums.AssistanceRequestStatus;
import com.example.domain.enums.MachineStatus;
import com.example.domain.enums.MaintenanceStatus;
import com.example.domain.enums.MaintenanceType;
import com.example.dto.MaintenanceDTO;
import com.example.dto.MaintenanceSessionDTO;
import com.example.dto.MaintenanceStatsDTO;
import com.example.repository.AssistanceRequestRepository;
import com.example.repository.MachineRepository;
import com.example.repository.MaintenanceLogRepository;
import com.example.repository.MaintenanceRepository;
import com.example.repository.MaintenanceSessionRepository;
import com.example.repository.TechnicianRepository;
import com.example.service.MachineMetricsService;
import com.example.service.MaintenanceService;
import com.example.service.TechnicianStatsService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/maintenances")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;
    private final MaintenanceSessionRepository sessionRepository;
    private final TechnicianRepository technicianRepository;
    private final MachineRepository machineRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final AssistanceRequestRepository assistanceRequestRepository;
    private final MaintenanceLogRepository maintenanceLogRepository;
    private final TechnicianStatsService technicianStatsService;
    private final MachineMetricsService machineMetricsService;

    @GetMapping
    public ResponseEntity<List<MaintenanceDTO>> getAllMaintenance() {
        return ResponseEntity.ok(maintenanceService.getAllMaintenanceDTO());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceDTO> getMaintenanceById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceByIdDTO(id));
    }

    @GetMapping("/machine/{machineId}")
    public ResponseEntity<List<MaintenanceDTO>> getByMachine(@PathVariable Long machineId) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceByMachineDTO(machineId));
    }

    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<List<MaintenanceDTO>> getByTechnician(@PathVariable Long technicianId) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceByTechnicianDTO(technicianId));
    }

    @PostMapping
    public ResponseEntity<MaintenanceDTO> createMaintenance(@Valid @RequestBody MaintenanceDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(maintenanceService.createMaintenanceDTO(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceDTO> updateMaintenance(@PathVariable Long id,
                                                            @Valid @RequestBody MaintenanceDTO dto) {
        return ResponseEntity.ok(maintenanceService.updateMaintenanceDTO(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaintenance(@PathVariable Long id) {
        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.noContent().build();
    }

    private MaintenanceSessionDTO toDTO(MaintenanceSession s) {
        MaintenanceSessionDTO dto = new MaintenanceSessionDTO();
        dto.setId(s.getId());
        dto.setTechnicianId(s.getTechnician().getId());
        dto.setTechnicianName(s.getTechnician().getName());
        dto.setMachineId(s.getMachine().getId());
        dto.setMachineName(s.getMachine().getName());
        dto.setStartTime(s.getStartTime());
        dto.setEndTime(s.getEndTime());
        dto.setActive(s.isActive());
        if (s.getMaintenanceRecord() != null) {
            dto.setMaintenanceRecordId(s.getMaintenanceRecord().getId());
        }
        dto.setSessionType("MAINTENANCE");
        return dto;
    }

    private MaintenanceSessionDTO assistanceToSessionDto(com.example.domain.AssistanceRequest request) {
        MaintenanceSessionDTO dto = new MaintenanceSessionDTO();
        dto.setAssistanceRequestId(request.getId());
        dto.setSessionType("ASSISTANCE");
        dto.setMachineId(request.getProblem().getMachine().getId());
        dto.setMachineName(request.getProblem().getMachine().getName());
        dto.setTechnicianId(request.getAssignedTechnician().getId());
        dto.setTechnicianName(request.getAssignedTechnician().getName());
        dto.setStartTime(request.getAcceptedAt() != null ? request.getAcceptedAt() : request.getCreatedAt());
        dto.setActive(true);
        return dto;
    }

    @Transactional
    @GetMapping("/current/{technicianId}")
    public ResponseEntity<MaintenanceSessionDTO> getCurrent(@PathVariable Long technicianId) {
        var sessions = sessionRepository.findByTechnicianIdAndActiveTrue(technicianId);

        if (sessions.isEmpty()) {
            var acceptedAssistance = assistanceRequestRepository.findAllAssignedToTechnician(technicianId)
                    .stream()
                    .filter(r -> r.getStatus() == AssistanceRequestStatus.ACCEPTED)
                    .sorted((a, b) -> {
                        LocalDateTime aTime = a.getAcceptedAt() != null ? a.getAcceptedAt() : a.getCreatedAt();
                        LocalDateTime bTime = b.getAcceptedAt() != null ? b.getAcceptedAt() : b.getCreatedAt();
                        return bTime.compareTo(aTime);
                    })
                    .toList();

            if (!acceptedAssistance.isEmpty()) {
                return ResponseEntity.ok(assistanceToSessionDto(acceptedAssistance.get(0)));
            }
            return ResponseEntity.noContent().build();
        }

        sessions.sort((a, b) -> b.getStartTime().compareTo(a.getStartTime()));
        MaintenanceSession active = sessions.get(0);

        for (int i = 1; i < sessions.size(); i++) {
            MaintenanceSession old = sessions.get(i);
            old.setActive(false);
            old.setEndTime(LocalDateTime.now());
            
            Machine oldMachine = old.getMachine();
            oldMachine.setStatus(MachineStatus.ACTIVE);
            machineRepository.save(oldMachine);
            
            sessionRepository.save(old);
        }

        return ResponseEntity.ok(toDTO(active));
    }

    @Transactional
    @PostMapping("/start")
    public ResponseEntity<MaintenanceSessionDTO> startMaintenance(
            @RequestParam Long technicianId,
            @RequestParam Long machineId) {

        Technician tech = technicianRepository.findById(technicianId)
                .orElseThrow(() -> new EntityNotFoundException("Technician not found"));

        Machine machine = machineRepository.findById(machineId)
                .orElseThrow(() -> new EntityNotFoundException("Machine not found"));

        var machineSessions = sessionRepository.findByMachineIdAndActiveTrue(machineId);
        if (machine.getStatus() == MachineStatus.MAINTENANCE) {
            if (!machineSessions.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
            }

            var openMaintenances = maintenanceRepository.findByMachineIdAndStatus(machineId, MaintenanceStatus.IN_PROGRESS);
            for (var m : openMaintenances) {
                m.setStatus(MaintenanceStatus.COMPLETED);
                maintenanceRepository.save(m);
            }

            machine.setStatus(MachineStatus.ACTIVE);
            machineRepository.save(machine);
        }

        var existingSessions = sessionRepository.findByTechnicianIdAndActiveTrue(technicianId);
        if (!existingSessions.isEmpty()) {
            existingSessions.sort((a, b) -> b.getStartTime().compareTo(a.getStartTime()));
            MaintenanceSession existing = existingSessions.get(0);

            if (existing.getMachine().getId().equals(machineId)) {
                return ResponseEntity.ok(toDTO(existing));
            }

            boolean staleSession = existing.getMachine().getStatus() != MachineStatus.MAINTENANCE;
            if (existing.getMaintenanceRecord() != null
                    && existing.getMaintenanceRecord().getStatus() != MaintenanceStatus.IN_PROGRESS) {
                staleSession = true;
            }

            if (staleSession) {
                for (MaintenanceSession stale : existingSessions) {
                    stale.setActive(false);
                    stale.setEndTime(LocalDateTime.now());

                    Machine staleMachine = stale.getMachine();
                    if (staleMachine.getStatus() == MachineStatus.MAINTENANCE) {
                        staleMachine.setStatus(MachineStatus.ACTIVE);
                        machineRepository.save(staleMachine);
                    }

                    sessionRepository.save(stale);
                }
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
            }
        }

        if (!tech.isAvailable()) {
            tech.setAvailable(true);
        }

        Maintenance record = Maintenance.builder()
                .machine(machine)
                .technician(tech)
                .status(MaintenanceStatus.IN_PROGRESS)
                .type(MaintenanceType.ORIGINAL)
                .build();
        record = maintenanceRepository.save(record);

        MaintenanceSession session = MaintenanceSession.builder()
                .technician(tech)
                .machine(machine)
                .startTime(LocalDateTime.now())
                .maintenanceRecord(record)
                .active(true)
                .build();

        session = sessionRepository.save(session);

        technicianStatsService.markBusy(tech, machine);
        technicianRepository.save(tech);

        machine.setStatus(MachineStatus.MAINTENANCE);
        machineRepository.save(machine);

        return ResponseEntity.ok(toDTO(session));
    }

    @Transactional
    @PutMapping("/finish/{sessionId}")
    public ResponseEntity<MaintenanceSessionDTO> finish(@PathVariable Long sessionId) {
        MaintenanceSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.isActive()) {
            return ResponseEntity.ok(toDTO(session));
        }

        session.setActive(false);
        session.setEndTime(LocalDateTime.now());
        
        if (session.getMaintenanceRecord() != null) {
            Maintenance record = session.getMaintenanceRecord();
            record.setStatus(MaintenanceStatus.COMPLETED);
            maintenanceRepository.save(record);
        }

        session = sessionRepository.save(session);

        var tech = session.getTechnician();
        var machine = session.getMachine();

        technicianStatsService.markAvailable(tech);
        technicianRepository.save(tech);

        var otherSessions = sessionRepository.findByMachineIdAndActiveTrue(machine.getId());
        for (MaintenanceSession other : otherSessions) {
            other.setActive(false);
            other.setEndTime(LocalDateTime.now());
            
            if (other.getMaintenanceRecord() != null) {
                Maintenance record = other.getMaintenanceRecord();
                record.setStatus(MaintenanceStatus.COMPLETED);
                maintenanceRepository.save(record);
            }
            
            var otherTech = other.getTechnician();
            if (!otherTech.getId().equals(tech.getId())) {
                technicianStatsService.markAvailable(otherTech);
                technicianRepository.save(otherTech);
            }
            
            sessionRepository.save(other);
        }

        var assistanceRequests = assistanceRequestRepository.findByProblemMachineIdAndStatusIn(
                machine.getId(), 
                List.of(AssistanceRequestStatus.PENDING, AssistanceRequestStatus.ACCEPTED)
        );
        for (var req : assistanceRequests) {
            req.setStatus(AssistanceRequestStatus.COMPLETED);
            req.setCompletedAt(LocalDateTime.now());
            var problem = req.getProblem();
            if (problem != null) {
                problem.setResolved(true);
                problem.setSolvedProblemDate(LocalDateTime.now());
            }
            if (req.getAssignedTechnician() != null) {
                var assistant = req.getAssignedTechnician();
                if (!assistant.getId().equals(tech.getId())) {
                    technicianStatsService.markAvailable(assistant);
                    technicianRepository.save(assistant);
                }
            }
            assistanceRequestRepository.save(req);
        }

        var openMaintenances = maintenanceRepository.findByMachineIdAndStatus(machine.getId(), MaintenanceStatus.IN_PROGRESS);
        for (var m : openMaintenances) {
            m.setStatus(MaintenanceStatus.COMPLETED);
            maintenanceRepository.save(m);
        }

        machine.setStatus(MachineStatus.ACTIVE);

        machine.setMaintenanceFinishedAt(LocalDateTime.now());
        machine.setSuspicionFlag(false);

        machineRepository.save(machine);
        machineMetricsService.refreshMetrics(machine.getId());

        return ResponseEntity.ok(toDTO(session));
    }

    @GetMapping("/stats/{techId}")
    public ResponseEntity<MaintenanceStatsDTO> getStats(@PathVariable Long techId) {
        Technician t = technicianRepository.findById(techId)
                .orElseThrow(() -> new EntityNotFoundException("Technician not found"));

        MaintenanceStatsDTO dto = MaintenanceStatsDTO.builder()
                .tasksCompleted(t.getTasksCompleted())
                .tasksPending(t.getTasksPending())
                .averageRepairTime(t.getAverageRepairTime())
                .assistedOthers(t.getAssistedCounter())
                .wasAssisted(t.getWasAssistedCounter())
                .available(t.isAvailable())
                .build();

        return ResponseEntity.ok(dto);
    }

    private double resolveSessionHours(MaintenanceSession session) {
        if (session.getMaintenanceRecord() != null) {
            var logs = maintenanceLogRepository.findByMaintenanceIdOrderByCreatedAtDesc(
                    session.getMaintenanceRecord().getId());
            if (!logs.isEmpty() && logs.get(0).getHoursSpent() != null) {
                return logs.get(0).getHoursSpent();
            }
        }
        if (session.getStartTime() != null) {
            return Math.max(0.1, ChronoUnit.MINUTES.between(session.getStartTime(), LocalDateTime.now()) / 60.0);
        }
        return 0.1;
    }
}