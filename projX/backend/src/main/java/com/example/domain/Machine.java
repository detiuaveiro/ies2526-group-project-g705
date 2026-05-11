package com.example.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.example.domain.enums.MachineStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "machines")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Machine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String location;

    private Integer importanceLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private MachineStatus status = MachineStatus.ACTIVE;

    private LocalDateTime lastDownDate;

    @Builder.Default
    private Double downtimeSum = 0.0;

    @Builder.Default
    private boolean suspicionFlag = false;

    @Builder.Default
    private boolean vibrationSensor = false;

    @Builder.Default
    private boolean temperatureSensor = false;

    @Builder.Default
    private boolean pressureSensor = false;

    @Column(nullable = false, columnDefinition = "integer default 0")
    @Builder.Default
    private int actionRequiredCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private int assistanceRequestedCount = 0;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime archivedAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "machine_technicians",
        joinColumns = @JoinColumn(name = "machine_id"),
        inverseJoinColumns = @JoinColumn(name = "technician_id")
    )
    @Builder.Default
    private List<Technician> assignedTechnicians = new ArrayList<>();

}
