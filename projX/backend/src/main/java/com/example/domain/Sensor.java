package com.example.domain;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "sensor_type")
@Getter
@NoArgsConstructor
public abstract class Sensor<T extends Reading> {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    @OneToMany(mappedBy = "sensor")
    private List<T> readings;

    public abstract T getMeasurement();
}

