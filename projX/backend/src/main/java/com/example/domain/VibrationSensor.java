package com.example.domain;


import java.util.List;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("VIB_SENSOR")
public class VibrationSensor extends Sensor<VibrationReading> {

    @Override
    public VibrationReading getMeasurement() {
        List<VibrationReading> readings = getReadings();
        if (readings == null || readings.isEmpty()) {
            return null;
        }
        return readings.get(readings.size() - 1);
    }
}