package com.example.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admins")
@DiscriminatorValue("ADMIN")
@Getter
@Setter
@NoArgsConstructor
public class Admin extends User {
    
}
