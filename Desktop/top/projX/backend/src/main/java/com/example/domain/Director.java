package com.example.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "directors")
@DiscriminatorValue("DIRECTOR")
@Getter
@Setter
@NoArgsConstructor
public class Director extends User {
    // Director-specific fields can be added here.
    // Relationships to technicians/machines are navigable via repositories.
}
