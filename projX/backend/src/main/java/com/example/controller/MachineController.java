package com.example.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.dto.AssignRequest;
import com.example.service.MachineService;
import com.example.dto.MachineDashboardStatsDTO;
import com.example.dto.MachineDTO;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/machines")
@RequiredArgsConstructor
public class MachineController {

    private final MachineService machineService;

    @GetMapping
    public ResponseEntity<List<MachineDTO>> getAllMachines() {
        return ResponseEntity.ok(machineService.getAllMachinesDTO());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MachineDTO> getMachineById(@PathVariable Long id) {
        return ResponseEntity.ok(machineService.getMachineByIdDTO(id));
    }

    @GetMapping("/archived")
    public ResponseEntity<List<MachineDTO>> getArchivedMachines() {
        return ResponseEntity.ok(machineService.getArchivedMachinesDTO());
    }

    @GetMapping("/active")
    public ResponseEntity<List<MachineDTO>> getActiveMachines() {
        return ResponseEntity.ok(machineService.getActiveMachinesDTO());
    }

    @GetMapping("/stats/dashboard")
    public ResponseEntity<MachineDashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(machineService.getDashboardStats());
    }

    @PostMapping
    public ResponseEntity<MachineDTO> createMachine(@Valid @RequestBody MachineDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(machineService.createMachineDTO(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MachineDTO> updateMachine(@PathVariable Long id, @Valid @RequestBody MachineDTO dto) {
        return ResponseEntity.ok(machineService.updateMachineDTO(id, dto));
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<MachineDTO> archiveMachine(@PathVariable Long id) {
        return ResponseEntity.ok(machineService.archiveMachineDTO(id));
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<MachineDTO> restoreMachine(@PathVariable Long id) {
        return ResponseEntity.ok(machineService.restoreMachineDTO(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMachine(@PathVariable Long id) {
        machineService.deleteMachine(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<MachineDTO> assignTechnician(
            @PathVariable Long id,
            @RequestBody AssignRequest request
    ) {
        if (request.getTechnicianIds() != null) {
            return ResponseEntity.ok(machineService.assignTechniciansDTO(id, request.getTechnicianIds()));
        }
        if (request.getTechnicianId() != null) {
            return ResponseEntity.ok(machineService.assignTechnicianDTO(id, request.getTechnicianId()));
        }
        return ResponseEntity.ok(machineService.assignTechniciansDTO(id, List.of()));
    }

    @GetMapping("/assigned/{technicianId}")
    public ResponseEntity<List<MachineDTO>> getMachinesAssignedToTechnician(@PathVariable Long technicianId) {
        return ResponseEntity.ok(machineService.getMachinesAssignedToTechnicianDTO(technicianId));
    }
}
