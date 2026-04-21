package com.example.controller;

import com.example.domain.Machine;
import com.example.dto.MachineDTO;
import com.example.service.MachineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/machines")
@RequiredArgsConstructor
public class MachineController {

    private final MachineService machineService;

    @GetMapping
    public ResponseEntity<List<Machine>> getAllMachines() {
        return ResponseEntity.ok(machineService.getAllMachines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Machine> getMachineById(@PathVariable Long id) {
        return ResponseEntity.ok(machineService.getMachineById(id));
    }

    @GetMapping("/archived")
    public ResponseEntity<List<Machine>> getArchivedMachines() {
        return ResponseEntity.ok(machineService.getArchivedMachines());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Machine>> getActiveMachines() {
        return ResponseEntity.ok(machineService.getActiveMachines());
    }

    @PostMapping
    public ResponseEntity<Machine> createMachine(@Valid @RequestBody MachineDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(machineService.createMachine(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Machine> updateMachine(@PathVariable Long id, @Valid @RequestBody MachineDTO dto) {
        return ResponseEntity.ok(machineService.updateMachine(id, dto));
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<Machine> archiveMachine(@PathVariable Long id) {
        return ResponseEntity.ok(machineService.archiveMachine(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMachine(@PathVariable Long id) {
        machineService.deleteMachine(id);
        return ResponseEntity.noContent().build();
    }
}
