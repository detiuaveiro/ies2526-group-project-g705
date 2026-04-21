package com.example.domain;

import java.time.LocalDateTime;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("TEMP")
public class TemperatureReading extends Reading {

    private float temperature;

    public float getTemperature(){
        return temperature;
    }
}