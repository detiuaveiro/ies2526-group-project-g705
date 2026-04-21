package com.example.service;

import com.example.domain.SensorReading;
import com.example.domain.enums.SensorType;
import com.example.dto.SensorReadingDTO;
import com.example.repository.MachineRepository;
import com.example.repository.SensorReadingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SensorService {

    private final SensorReadingRepository sensorReadingRepository;
    private final MachineRepository machineRepository;

    @Transactional(readOnly = true)
    public List<SensorReading> getReadingsByMachine(Long machineId) {
        return sensorReadingRepository.findByMachineId(machineId);
    }

    @Transactional(readOnly = true)
    public List<SensorReading> getReadingsByMachineAndType(Long machineId, SensorType type) {
        return sensorReadingRepository.findByMachineIdAndSensorType(machineId, type);
    }

    @Transactional(readOnly = true)
    public List<SensorReading> getLatestReadings(Long machineId, SensorType type) {
        return sensorReadingRepository
                .findTop50ByMachineIdAndSensorTypeOrderByRecordedAtDesc(machineId, type);
    }

    public SensorReading createReading(SensorReadingDTO dto) {
        var machine = machineRepository.findById(dto.getMachineId())
                .orElseThrow(() -> new EntityNotFoundException("Machine not found with id: " + dto.getMachineId()));

        SensorReading reading = SensorReading.builder()
                .machine(machine)
                .sensorType(dto.getSensorType())
                .value(dto.getValue())
                .recordedAt(dto.getRecordedAt())
                .build();

        return sensorReadingRepository.save(reading);
    }

    public void deleteReading(Long id) {
        sensorReadingRepository.deleteById(id);
    }
}
