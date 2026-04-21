package com.example.controller;

import com.example.domain.SensorReading;
import com.example.domain.enums.SensorType;
import com.example.dto.SensorReadingDTO;
import com.example.service.SensorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sensors")
@RequiredArgsConstructor
public class SensorController {

    private final SensorService sensorService;

    @GetMapping("/{machineId}")
    public ResponseEntity<List<SensorReading>> getReadingsByMachine(@PathVariable Long machineId) {
        return ResponseEntity.ok(sensorService.getReadingsByMachine(machineId));
    }

    @GetMapping("/{machineId}/{type}")
    public ResponseEntity<List<SensorReading>> getReadingsByMachineAndType(
            @PathVariable Long machineId,
            @PathVariable SensorType type) {
        return ResponseEntity.ok(sensorService.getReadingsByMachineAndType(machineId, type));
    }

    @GetMapping("/{machineId}/{type}/latest")
    public ResponseEntity<List<SensorReading>> getLatestReadings(
            @PathVariable Long machineId,
            @PathVariable SensorType type) {
        return ResponseEntity.ok(sensorService.getLatestReadings(machineId, type));
    }

    @PostMapping
    public ResponseEntity<SensorReading> createReading(@Valid @RequestBody SensorReadingDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sensorService.createReading(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReading(@PathVariable Long id) {
        sensorService.deleteReading(id);
        return ResponseEntity.noContent().build();
    }
}
