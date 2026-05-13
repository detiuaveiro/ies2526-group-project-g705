package com.example.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technician_id", nullable = false)
    private Technician technician;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = true)
    private AssistanceRequest request;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Builder.Default
    private boolean active = true;
}
