package com.example.domain;


import java.util.List;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("VIB_SENSOR")
public class VibrationSensor extends Sensor {

    @Override
    public Reading getMeasurement() {
        List<Reading> readings = getReadings();
        if (readings == null || readings.isEmpty()) {
            return null;
        }
        return readings.get(readings.size() - 1);
    }
}