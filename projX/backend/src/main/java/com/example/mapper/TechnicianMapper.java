package com.example.mapper;

import com.example.domain.Machine;
import com.example.domain.Technician;
import com.example.dto.TechnicianDTO;

import java.util.ArrayList;
import java.util.List;

public class TechnicianMapper {

    public static TechnicianDTO toDTO(Technician t) {
        String machineName = resolveMachineName(t.getCurrentAssignment());
        String activity = t.isAvailable()
                ? "Available"
                : (machineName != null ? "Working on " + machineName : "Busy");

        return TechnicianDTO.builder()
                .id(t.getId())
                .name(t.getName())
                .email(t.getEmail())
                .phoneNumber(t.getPhoneNumber())
                .available(t.isAvailable())
                .currentMachineName(machineName)
                .currentActivity(activity)
                .tasksCompleted(t.getTasksCompleted())
                .tasksPending(t.getTasksPending())
                .numberOfFaultsFixed(t.getNumberOfFaultsFixed())
                .averageRepairTime(t.getAverageRepairTime())
                .skillSet(copySkillSet(t))
                .build();
    }

    private static String resolveMachineName(Machine assignment) {
        if (assignment == null) {
            return null;
        }
        try {
            return assignment.getName();
        } catch (Exception e) {
            return null;
        }
    }

    private static List<String> copySkillSet(Technician t) {
        try {
            if (t.getSkillSet() == null || t.getSkillSet().isEmpty()) {
                return List.of();
            }
            return new ArrayList<>(t.getSkillSet());
        } catch (Exception e) {
            return List.of();
        }
    }
}
