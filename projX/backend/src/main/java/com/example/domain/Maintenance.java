package com.example.domain;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@AllArgsConstructor
@Table(name = "maintenances")
public class Maintenance {

    @Id
    @GeneratedValue
    private UUID maintenanceID;

    @ManyToOne
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    @ManyToOne
    @JoinColumn(name = "technician_id", nullable = false)
    private MaintenanceTechnician technician;

    @Enumerated(EnumType.STRING)
    @Column(name="type", nullable = false)
    private MaintenanceType type;

    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable = false)
    private MaintenanceStatus status;

    @Column(name="notes", nullable=false)
    private String notes;


    public void start(){

    }

    public void complete(){

    }
}