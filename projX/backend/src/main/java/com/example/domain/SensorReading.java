package com.example.domain;

import com.example.domain.enums.SensorType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sensor_readings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensorReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The full Machine entity is excluded from serialization to avoid circular references.
     * The machineId is exposed separately via the @JsonProperty getter below.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SensorType sensorType;

    @Column(nullable = false)
    private Double value;

    @Column(nullable = false)
    private LocalDateTime recordedAt;

    /**
     * Expose machineId in JSON response without loading the full Machine object.
     * e.g.: { "id": 1, "machineId": 5, "sensorType": "TEMPERATURE", "value": 72.3, "recordedAt": "..." }
     */
    @JsonProperty("machineId")
    public Long getMachineId() {
        return machine != null ? machine.getId() : null;
    }
}
