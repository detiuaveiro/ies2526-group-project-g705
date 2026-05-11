package com.example.domain;

import java.util.List;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("PRES_SENSOR")
public class PressureSensor extends Sensor {

    @Override
    public Reading getMeasurement() {
        List<Reading> readings = getReadings();
        if (readings == null || readings.isEmpty()) {
            return null;
        }
        return readings.get(readings.size() - 1);
    }
}