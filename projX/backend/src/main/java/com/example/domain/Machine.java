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
@Table(name = "machines")
public class Machine {

    @Id
    @GeneratedValue
    private UUID machineId;

    @Column(name="name", nullable=false)
    private String name;

    @Column(name="location", nullable=false)
    private String location;

    @Column(name="importanceLevel", nullable=false)
    private int importanceLevel;

    @Enumerated(EnumType.STRING)
    @Column(name="status",nullable = false)
    private MachineStatus status;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @Column(name="suspicionFlag", nullable=false)
    private boolean suspicionFlag;

    private void updateStatus(MachineStatus status){
        this.status = status;
    }

    private float calculateDowntime(){
        return 20;
    }
}