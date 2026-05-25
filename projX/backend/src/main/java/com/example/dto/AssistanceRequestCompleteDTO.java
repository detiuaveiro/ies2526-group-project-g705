package com.example.dto;

import lombok.Data;

@Data
public class AssistanceRequestCompleteDTO {
    private String title;
    private String description;
    private Double hoursSpent;
    private String partsUsed;
    private String technicianId;

    public boolean hasLogData() {
        return title != null && !title.isBlank()
                && description != null && !description.isBlank()
                && hoursSpent != null && hoursSpent > 0
                && partsUsed != null && !partsUsed.isBlank();
    }
}
