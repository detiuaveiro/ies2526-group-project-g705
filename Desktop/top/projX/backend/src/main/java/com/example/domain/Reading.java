package com.example.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor; // ADICIONE ESTA LINHA
import java.time.LocalDateTime;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "reading_type")
@Getter
@Setter
@NoArgsConstructor
public class Reading { // Ensure 'abstract' is removed if you want to 'new Reading()'
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "sensor_id")
    private Sensor sensor;
    
    private Double value;
    private LocalDateTime timestamp;
}