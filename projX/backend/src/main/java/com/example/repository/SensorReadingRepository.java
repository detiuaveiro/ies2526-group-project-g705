package com.example.repository;

import com.example.domain.SensorReading;
import com.example.domain.enums.SensorType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorReadingRepository extends JpaRepository<SensorReading, Long> {
    List<SensorReading> findByMachineId(Long machineId);
    List<SensorReading> findByMachineIdAndSensorType(Long machineId, SensorType sensorType);
    List<SensorReading> findTop50ByMachineIdAndSensorTypeOrderByRecordedAtDesc(Long machineId, SensorType sensorType);
}
