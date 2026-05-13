package com.example.domain;

import com.example.domain.enums.MachineStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;

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
}
