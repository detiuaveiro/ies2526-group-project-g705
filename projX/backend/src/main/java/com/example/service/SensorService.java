package com.example.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

@Service
@RequiredArgsConstructor
public class SensorService {

    private static final long COOLDOWN_SECONDS = 15;

    private final SensorReadingRepository sensorReadingRepository;
    private final MachineRepository machineRepository;
    private final ProblemRepository problemRepository;

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

        if (problemDescription == null) {
            return;
        }

        List<Problem> existing =
                problemRepository.findByMachineIdAndDescriptionContainingAndResolvedFalse(
                        machine.getId(), type.toString()
                );

        if (!existing.isEmpty()) {
            return;
        }

        if (machine.getMaintenanceFinishedAt() != null) {

            boolean inCooldown = machine.getMaintenanceFinishedAt()
                    .isAfter(LocalDateTime.now().minusSeconds(COOLDOWN_SECONDS));

            if (inCooldown) {
                // Ignora sensores durante cooldown
                return;
            }
        }

        Problem problem = Problem.builder()
                .machine(machine)
                .description(problemDescription)
                .detectedAt(LocalDateTime.now())
                .startProblemDate(LocalDateTime.now())
                .faultSeverity("CRITICAL")
                .priority(1.0)
                .resolved(false)
                .build();

        problemRepository.save(problem);

        machine.setSuspicionFlag(true);
        machineRepository.save(machine);
    }

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

    @Transactional(readOnly = true)
    public List<SensorReading> getReadingsByMachine(Long machineId) {
        return sensorReadingRepository.findByMachine_IdOrderByRecordedAtDesc(machineId);
    }
}