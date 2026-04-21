package com.example.controller;

import com.example.domain.Maintenance;
import com.example.dto.MaintenanceDTO;
import com.example.service.MaintenanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @GetMapping
    public ResponseEntity<List<Maintenance>> getAllMaintenance() {
        return ResponseEntity.ok(maintenanceService.getAllMaintenance());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Maintenance> getMaintenanceById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceById(id));
    }

    @GetMapping("/machine/{machineId}")
    public ResponseEntity<List<Maintenance>> getByMachine(@PathVariable Long machineId) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceByMachine(machineId));
    }

    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<List<Maintenance>> getByTechnician(@PathVariable Long technicianId) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceByTechnician(technicianId));
    }

    @PostMapping
    public ResponseEntity<Maintenance> createMaintenance(@Valid @RequestBody MaintenanceDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(maintenanceService.createMaintenance(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Maintenance> updateMaintenance(@PathVariable Long id, @Valid @RequestBody MaintenanceDTO dto) {
        return ResponseEntity.ok(maintenanceService.updateMaintenance(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaintenance(@PathVariable Long id) {
        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.noContent().build();
    }
}
