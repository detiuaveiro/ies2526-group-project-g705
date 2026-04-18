package com.example.domain;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@AllArgsConstructor
@Table(name = "problems")
public class Problem {

    @Id
    @GeneratedValue
    private UUID problemID;

    @ManyToOne
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;
 
    @Column(name="description", nullable=false)
    private String description;

    @Column(name="importanceLevel", nullable=false)
    private int importanceLevel;

    @Column(name="priority", nullable=false)
    private float priority;

    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable = false)
    private MachineStatus status;

    @Column(name = "detectedAt")
    private LocalDateTime detectedAt;

    @Column(name = "startProblemDate")
    private LocalDateTime startProblemDate;


    @Column(name = "solvedProblemDate")
    private LocalDateTime solvedProblemDate;

    @Column(name="resolved", nullable=false)
    private boolean resolved;

    @ManyToOne
    @JoinColumn(name = "assigned_technician")
    private MaintenanceTechnician assignedTechnician;

    @Column(name="faultSeverity", nullable=false)
    private String faultSeverity;


    public void start(){

    }

    public void complete(){

    }
}