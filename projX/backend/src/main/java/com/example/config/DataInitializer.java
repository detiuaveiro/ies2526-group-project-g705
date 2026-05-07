package com.example.config;

import com.example.domain.enums.MachineStatus;
import com.example.dto.MachineDTO;
import com.example.repository.MachineRepository;
import com.example.service.MachineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Automatically initializes the database with test machines on application startup.
 * Creates 100 machines for testing. Sensor readings are provided by sensor_publisher.py.
 * This data is ephemeral and will be deleted when containers are stopped.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final MachineService machineService;
    private final MachineRepository machineRepository;

    private static final int TOTAL_MACHINES = 100;

    @EventListener(ApplicationReadyEvent.class)
    public void initializeData() {
        log.info("Starting data initialization...");

        // Check if machines already exist
        if (machineRepository.count() > 0) {
            log.info("Machines already exist in database, skipping initialization");
            return;
        }

        try {
            // Create machines
            log.info("Creating {} machines...", TOTAL_MACHINES);
            long startTime = System.currentTimeMillis();

            for (int i = 1; i <= TOTAL_MACHINES; i++) {
                MachineDTO machineDTO = MachineDTO.builder()
                        .name("Machine " + i)
                        .location("Production Floor - Section " + ((i - 1) / 10 + 1))
                        .importanceLevel((i % 5) + 1)
                        .status(MachineStatus.ACTIVE)
                        .downtimeSum(0.0)
                        .suspicionFlag(false)
                        .build();

                machineService.createMachine(machineDTO);

                if (i % 20 == 0) {
                    log.debug("Created {} machines so far...", i);
                }
            }

            long machineCreationTime = System.currentTimeMillis() - startTime;
            log.info("✓ Created {} machines in {}ms", TOTAL_MACHINES, machineCreationTime);
            log.info("✓ Data initialization complete! Machines ready for sensor data from sensor_publisher.py");

        } catch (Exception e) {
            log.error("Error during data initialization", e);
            throw new RuntimeException("Data initialization failed", e);
        }
    }
}
