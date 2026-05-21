package com.example.service;

import com.example.domain.Machine;
import com.example.domain.Technician;
import org.springframework.stereotype.Service;

@Service
public class TechnicianStatsService {

    public void markBusy(Technician tech, Machine machine) {
        tech.setAvailable(false);
        tech.setCurrentAssignment(machine);
        tech.setTasksPending(tech.getTasksPending() + 1);
    }

    public void markAvailable(Technician tech) {
        tech.setAvailable(true);
        tech.setCurrentAssignment(null);
        tech.setTasksPending(Math.max(0, tech.getTasksPending() - 1));
        tech.setTasksCompleted(tech.getTasksCompleted() + 1);
    }

    /** Releases technician from an assistance assignment without counting as completed work. */
    public void releaseFromAssistanceAssignment(Technician tech) {
        tech.setAvailable(true);
        tech.setCurrentAssignment(null);
        tech.setTasksPending(Math.max(0, tech.getTasksPending() - 1));
    }

    public void releaseFromMachineWork(Technician tech, boolean countAsCompleted) {
        tech.setAvailable(true);
        tech.setCurrentAssignment(null);
        tech.setTasksPending(Math.max(0, tech.getTasksPending() - 1));
        if (countAsCompleted) {
            tech.setTasksCompleted(tech.getTasksCompleted() + 1);
        }
    }

    /** Counts only completed assistance work (Team Activity "Faults Fixed"). */
    public void recordAssistanceCompletion(Technician tech, double hours) {
        if (hours <= 0) {
            hours = 0.1;
        }
        int previous = tech.getAssistedCounter();
        double previousAvg = tech.getAverageRepairTime();
        tech.setAssistedCounter(previous + 1);
        tech.setAverageRepairTime((previousAvg * previous + hours) / (previous + 1));
    }

}
