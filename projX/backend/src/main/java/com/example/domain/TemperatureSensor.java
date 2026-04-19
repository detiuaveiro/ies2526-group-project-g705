package com.example.domain;

import java.util.List;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("TEMP_SENSOR")
public class TemperatureSensor extends Sensor<TemperatureReading> {

    @Override
    public TemperatureReading getMeasurement() {
        List<TemperatureReading> readings = getReadings();
        if (readings == null || readings.isEmpty()) {
            return null;
        }
        return readings.get(readings.size() - 1);
    }
}