package com.example.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "technicians")
@DiscriminatorValue("TECHNICIAN")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Technician extends User {

    private int numberOfFaultsFixed = 0;
    private int assistedCounter = 0;
    private int wasAssistedCounter = 0;
    private double averageRepairTime = 0.0;
    private int tasksCompleted = 0;
    private int tasksPending = 0;
    private boolean isAvailable = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_machine_id")
    private Machine currentAssignment;

    @ElementCollection
    @CollectionTable(name = "technician_skills", joinColumns = @JoinColumn(name = "technician_id"))
    @Column(name = "skill")
    private List<String> skillSet = new ArrayList<>();
}
