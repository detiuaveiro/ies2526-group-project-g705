package com.example.domain.enums;

public enum MaintenanceType {
    ORIGINAL,
    NORMAL,
    SPECIAL,
    ASSISTANCE;

    public boolean isOriginal() {
        return this == ORIGINAL || this == NORMAL || this == SPECIAL;
    }
}
