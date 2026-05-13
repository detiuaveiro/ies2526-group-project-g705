package com.example.service;

import com.example.domain.Machine;
import com.example.domain.SensorReading;
import com.example.domain.enums.SensorType;
import com.example.dto.SensorReadingDTO;
import com.example.repository.MachineRepository;
import com.example.repository.SensorReadingRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SensorService {

    private final SensorReadingRepository sensorReadingRepository;
    private final MachineRepository machineRepository;

    /**
     * Persists a new sensor reading received from RabbitMQ.
     * Called by RabbitConsumer on every incoming message.
     */
    @Transactional
    public SensorReading createReading(SensorReadingDTO dto) {
        Machine machine = machineRepository.findById(dto.getMachineId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Machine not found with id: " + dto.getMachineId()));

        SensorReading reading = SensorReading.builder()
                .machine(machine)
                .sensorType(dto.getSensorType())
                .value(dto.getValue())
                .recordedAt(dto.getRecordedAt())
                .build();

        return sensorReadingRepository.save(reading);
    }

    /**
     * Returns the MOST RECENT reading for each sensor type (TEMPERATURE, PRESSURE, VIBRATION)
     * for a given machine. This gives exactly 3 entries (one per type) at
     * GET /api/v1/sensors/{machineId}
     */
    @Transactional(readOnly = true)
    public List<SensorReading> getLatestState(Long machineId) {
        List<SensorReading> result = new ArrayList<>();
        for (SensorType type : SensorType.values()) {
            sensorReadingRepository
                    .findTopByMachine_IdAndSensorTypeOrderByRecordedAtDesc(machineId, type)
                    .ifPresent(result::add);
        }
        return result;
    }

    /**
     * Returns the full history of ALL sensor readings for a machine, newest first.
     * Used at GET /api/v1/sensors/{machineId}/history for graphing.
     */
    @Transactional(readOnly = true)
    public List<SensorReading> getReadingsByMachine(Long machineId) {
        return sensorReadingRepository.findByMachine_IdOrderByRecordedAtDesc(machineId);
    }
}