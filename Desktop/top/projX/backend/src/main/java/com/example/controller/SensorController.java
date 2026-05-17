package com.example.controller;

import com.example.domain.SensorReading;
import com.example.service.SensorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * GET /api/v1/sensors/{machineId}
 *   → Returns the most recent reading for each sensor type (TEMPERATURE, PRESSURE, VIBRATION).
 *     Always at most 3 entries — one per type — for the given machine.
 *
 * GET /api/v1/sensors/{machineId}/history
 *   → Returns the full history of all readings for the machine, newest first.
 *     Use this endpoint to build graphs/charts.
 */
@RestController
@RequestMapping("/api/v1/sensors")
@RequiredArgsConstructor
public class SensorController {

    private final SensorService sensorService;

    /**
     * Latest state: one reading per sensor type (max 3 entries).
     * Every new batch from the generator replaces what's shown here.
     */
    @GetMapping("/{machineId}")
    public ResponseEntity<List<SensorReading>> getLatestState(@PathVariable Long machineId) {
        return ResponseEntity.ok(sensorService.getLatestState(machineId));
    }

    /**
     * Full history: all readings ever stored for this machine, newest first.
     * Use for graphing previous values over time.
     */
    @GetMapping("/{machineId}/history")
    public ResponseEntity<List<SensorReading>> getFullHistory(@PathVariable Long machineId) {
        return ResponseEntity.ok(sensorService.getReadingsByMachine(machineId));
    }
}