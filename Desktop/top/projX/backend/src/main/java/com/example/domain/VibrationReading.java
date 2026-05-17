package com.example.domain;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("VIBRATION")
public class VibrationReading extends Reading {

    private float vibration;

    public float getMeasurement(){
        return vibration;
    }
}