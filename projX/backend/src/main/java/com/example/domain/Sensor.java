package com.example.domain;

import java.util.List;

import com.example.domain.enums.SensorType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "sensor_class") // Distinguishes between Pressure/Temp sensors
@Getter
@Setter
@NoArgsConstructor
public abstract class Sensor<T extends Reading> { // Add the <T extends Reading>

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long machineId;

    @Enumerated(EnumType.STRING)
    private SensorType sensorType;

    // This allows the subclasses to have a list of their specific reading types
    @OneToMany(mappedBy = "sensor")
    private List<T> readings; 

    public abstract T getMeasurement();
}