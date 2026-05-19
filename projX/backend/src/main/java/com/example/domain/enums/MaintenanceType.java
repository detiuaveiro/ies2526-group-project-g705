package com.example.domain.enums;

public enum MaintenanceType {
    ORIGINAL,
    NORMAL,
    ASSISTANCE;

    public boolean isOriginal() {
        return this == ORIGINAL || this == NORMAL;
    }
}
