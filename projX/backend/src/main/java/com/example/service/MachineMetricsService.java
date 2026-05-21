package com.example.service;

import com.example.domain.Machine;
import com.example.domain.enums.AssistanceRequestStatus;
import com.example.repository.AssistanceRequestRepository;
import com.example.repository.MaintenanceLogRepository;
import com.example.repository.MachineRepository;
import com.example.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MachineMetricsService {

    private static final List<AssistanceRequestStatus> ACTIVE_ASSISTANCE_STATUSES =
            List.of(AssistanceRequestStatus.PENDING, AssistanceRequestStatus.ACCEPTED);

    private final MachineRepository machineRepository;
    private final MaintenanceLogRepository maintenanceLogRepository;
    private final ProblemRepository problemRepository;
    private final AssistanceRequestRepository assistanceRequestRepository;

    public void refreshMetrics(Long machineId) {
        machineRepository.findById(machineId).ifPresent(this::refreshMetrics);
    }

    public void refreshMetrics(Machine machine) {
        Double downtime = maintenanceLogRepository.sumHoursSpentByMachineId(machine.getId());
        machine.setDowntimeSum(downtime != null ? downtime : 0.0);

        machine.setActionRequiredCount(
                problemRepository.findByMachineIdAndResolvedFalse(machine.getId()).size()
        );

        long activeAssistance = assistanceRequestRepository.countByProblemMachineIdAndStatusIn(
                machine.getId(),
                ACTIVE_ASSISTANCE_STATUSES
        );
        machine.setAssistanceRequestedCount((int) activeAssistance);

        machineRepository.save(machine);
    }
}
