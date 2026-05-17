package com.example.domain;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "maintenance_directors")
public class MaintenanceDirector extends User {
    @ElementCollection
    @CollectionTable(
        name = "director_technicians",
        joinColumns = @JoinColumn(name = "director_id")
    )
    @Column(name = "technician_id", nullable = false)
    private List<UUID> technicianIds;


    @ElementCollection
    @CollectionTable(
        name = "director_machines",
        joinColumns = @JoinColumn(name = "director_id")
    )
    @Column(name = "machine_id", nullable = false)
    private List<UUID> machineIds;
}
