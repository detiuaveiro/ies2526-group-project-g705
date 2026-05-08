package com.example.repository;

import com.example.domain.SensorReading;
import com.example.domain.enums.SensorType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SensorReadingRepository extends JpaRepository<SensorReading, Long> {

    /**
     * Returns the single most recent reading for a given machine + sensor type.
     * Used by GET /api/v1/sensors/{machineId} to get the "current" value per type.
     */
    Optional<SensorReading> findTopByMachine_IdAndSensorTypeOrderByRecordedAtDesc(
            Long machineId, SensorType sensorType);

    /**
     * Returns ALL readings for a machine, newest first.
     * Used by GET /api/v1/sensors/{machineId}/history for graphing.
     */
    List<SensorReading> findByMachine_IdOrderByRecordedAtDesc(Long machineId);
}
