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
public abstract class Sensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long machineId;

    @Enumerated(EnumType.STRING)
    private SensorType sensorType;

    @OneToMany(mappedBy = "sensor")
    private List<Reading> readings;

    public abstract Reading getMeasurement();
}