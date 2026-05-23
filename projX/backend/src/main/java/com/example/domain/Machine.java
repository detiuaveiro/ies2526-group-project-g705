package com.example.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.example.domain.enums.MachineStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "machines")
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

    @Builder.Default
    private Integer actionRequiredCount = 0;

    @Builder.Default
    private Integer assistanceRequestedCount = 0;

    @ManyToMany
    @JoinTable(
            name = "machine_technician",
            joinColumns = @JoinColumn(name = "machine_id"),
            inverseJoinColumns = @JoinColumn(name = "technician_id")
    )
    @Builder.Default
    private List<Technician> assignedTechnicians = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime archivedAt;

    @Builder.Default
    private LocalDateTime maintenanceFinishedAt = null;
}
