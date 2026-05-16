package com.example.controller;

import com.example.dto.MaintenanceDTO;
import com.example.dto.MaintenanceSessionDTO;
import com.example.dto.MaintenanceStatsDTO;
import com.example.domain.MaintenanceSession;
import com.example.domain.Technician;
import com.example.service.MaintenanceService;
import com.example.repository.MaintenanceSessionRepository;
import com.example.repository.TechnicianRepository;
import com.example.repository.MachineRepository;
import com.example.domain.enums.MachineStatus;
import com.example.domain.enums.MaintenanceStatus;
import com.example.domain.enums.MaintenanceType;
import com.example.domain.Machine;
import com.example.domain.Maintenance;
import com.example.repository.MaintenanceRepository;
import com.example.repository.AssistanceRequestRepository;
import com.example.domain.enums.AssistanceRequestStatus;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

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
        return dto;
    }

    @Transactional
    @GetMapping("/current/{technicianId}")
    public ResponseEntity<MaintenanceSessionDTO> getCurrent(@PathVariable Long technicianId) {
        var sessions = sessionRepository.findByTechnicianIdAndActiveTrue(technicianId);

        if (sessions.isEmpty()) {
            return ResponseEntity.notFound().build();
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

        // Check if this technician already has an active session
        var existingSessions = sessionRepository.findByTechnicianIdAndActiveTrue(technicianId);
        if (!existingSessions.isEmpty()) {
            existingSessions.sort((a, b) -> b.getStartTime().compareTo(a.getStartTime()));
            MaintenanceSession existing = existingSessions.get(0);

            // Same machine → return existing session (idempotent)
            if (existing.getMachine().getId().equals(machineId)) {
                return ResponseEntity.ok(toDTO(existing));
            }

            // Different machine → technician already busy with another machine
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

        // Technician flagged as unavailable but no active session (stale state) → reset
        if (!tech.isAvailable()) {
            tech.setAvailable(true);
        }

        Maintenance record = Maintenance.builder()
                .machine(machine)
                .technician(tech)
                .status(MaintenanceStatus.IN_PROGRESS)
                .type(MaintenanceType.NORMAL)
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

        tech.setAvailable(false);
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
        
        // Update historical record
        if (session.getMaintenanceRecord() != null) {
            Maintenance record = session.getMaintenanceRecord();
            record.setStatus(MaintenanceStatus.COMPLETED);
            maintenanceRepository.save(record);
        }

        session = sessionRepository.save(session);

        var tech = session.getTechnician();
        var machine = session.getMachine();

        tech.setAvailable(true);
        tech.setTasksCompleted(tech.getTasksCompleted() + 1);
        tech.setCurrentAssignment(null);
        technicianRepository.save(tech);

        // --- CONCLUDE EVERYTHING ELSE ON THIS MACHINE ---
        
        // 1. Close all other active sessions for this machine
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
                otherTech.setAvailable(true);
                otherTech.setTasksCompleted(otherTech.getTasksCompleted() + 1);
                otherTech.setCurrentAssignment(null);
                technicianRepository.save(otherTech);
            }
            
            sessionRepository.save(other);
        }

        // 2. Complete all assistance requests for this machine
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
            }
            assistanceRequestRepository.save(req);
        }

        // 3. Mark all IN_PROGRESS maintenance records for this machine as COMPLETED
        var openMaintenances = maintenanceRepository.findByMachineIdAndStatus(machine.getId(), MaintenanceStatus.IN_PROGRESS);
        for (var m : openMaintenances) {
            m.setStatus(MaintenanceStatus.COMPLETED);
            maintenanceRepository.save(m);
        }

        machine.setStatus(MachineStatus.ACTIVE);
        machine.setActionRequiredCount(0); // Everything concluded
        machineRepository.save(machine);

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
}
