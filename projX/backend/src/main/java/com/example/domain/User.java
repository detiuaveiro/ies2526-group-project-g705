package com.example.domain;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "users")
public abstract class User {

    @Id
    @GeneratedValue
    private UUID userID;

    @Column(name="name", nullable=false)
    private String name;

    @Column(name="age", nullable=false)
    private int age;

    @Enumerated(EnumType.STRING)
    @Column(name="gender", nullable=false)
    private Gender gender;

    @Column(name="email", nullable=false)
    private String email;

    @Column(name="passwordHash", nullable=false)
    private String passwordHash;

    @Column(name="phoneNumber", nullable=false)
    private String phoneNumber;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @Column(name="isPrivileged", nullable=false)
    private boolean isPrivileged;
}