package com.example.domain;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "reading_type")
@Getter
@NoArgsConstructor
public abstract class Reading {

    @Id
    @GeneratedValue
    private UUID id;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "sensor_id", nullable = false)
    private Sensor<? extends Reading> sensor;
}