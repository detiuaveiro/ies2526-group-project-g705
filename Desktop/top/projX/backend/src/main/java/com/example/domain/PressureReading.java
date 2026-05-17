package com.example.domain;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("PRESSURE")
public class PressureReading extends Reading {

    private float pressure;

    public float getMeasurement(){
        return pressure;
    }
}