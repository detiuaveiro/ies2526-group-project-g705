package com.example.service;

import com.example.domain.Machine;
import com.example.domain.Problem;
import com.example.domain.SensorReading;
import com.example.domain.enums.SensorType;
import com.example.dto.SensorReadingDTO;
import com.example.repository.MachineRepository;
import com.example.repository.ProblemRepository;
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
    private final ProblemRepository problemRepository;

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

        SensorReading saved = sensorReadingRepository.save(reading);
        classifyReading(saved);
        return saved;
    }

    /**
     * Checks if a reading exceeds safety thresholds and creates a Problem if necessary.
     */
    private void classifyReading(SensorReading reading) {
        double value = reading.getValue();
        SensorType type = reading.getSensorType();
        Machine machine = reading.getMachine();

        String problemDescription = null;
        if (type == SensorType.TEMPERATURE && value > 80.0) {
            problemDescription = "Critical Temperature detected: " + value + "°C";
        } else if (type == SensorType.PRESSURE && value > 5.5) {
            problemDescription = "High Pressure detected: " + value + " bar";
        } else if (type == SensorType.VIBRATION && value > 0.7) {
            problemDescription = "Excessive Vibration detected: " + value + " mm/s";
        }

        if (problemDescription != null) {
            // Check if an unresolved problem with a similar description already exists for this machine
            List<Problem> existing = problemRepository.findByMachineIdAndDescriptionContainingAndResolvedFalse(
                    machine.getId(), type.toString());
            
            if (existing.isEmpty()) {
                Problem problem = Problem.builder()
                        .machine(machine)
                        .description(problemDescription)
                        .detectedAt(java.time.LocalDateTime.now())
                        .startProblemDate(java.time.LocalDateTime.now())
                        .faultSeverity("CRITICAL")
                        .priority(1.0)
                        .resolved(false)
                        .build();
                problemRepository.save(problem);
                
                // Flag the machine
                machine.setSuspicionFlag(true);
                machineRepository.save(machine);
            }
        }
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