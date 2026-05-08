package com.example.repository;

import com.example.domain.Sensor;
import com.example.domain.enums.SensorType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface SensorRepository extends JpaRepository<Sensor, Long> {
    
    // Add this line to fix the error
    Optional<Sensor> findByMachineIdAndSensorType(Long machineId, SensorType sensorType);
    
    // Return all sensors for a given machine
    List<Sensor> findByMachineId(Long machineId);
}