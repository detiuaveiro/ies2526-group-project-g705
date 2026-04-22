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
@Table(name = "requests")
public class Request {

    @Id
    @GeneratedValue
    private UUID requestID;

    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @ManyToOne
    @JoinColumn(name = "requested_by", nullable = false)
    private User requestedBy;

    @Column(name="reason", nullable=false)
    private String reason;

    @ManyToOne
    @JoinColumn(name = "assigned_technician")
    private Technician assignedTechnician;

    @Enumerated(EnumType.STRING)
    @Column(name="status",nullable = false)
    private RequestStatus status;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    public void accept(Technician technician){
        this.assignedTechnician = technician;
    }

    public void complete(){

    }
}