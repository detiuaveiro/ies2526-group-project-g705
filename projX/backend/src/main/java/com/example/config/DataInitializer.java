package com.example.config;

import com.example.domain.User;
import com.example.domain.enums.MachineStatus;
import com.example.domain.enums.UserRole;
import com.example.dto.MachineDTO;
import com.example.dto.UserDTO;
import com.example.repository.MachineRepository;
import com.example.repository.UserRepository;
import com.example.service.MachineService;
import com.example.service.UserService;
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
    private final UserService userService;
    private final UserRepository userRepository;

    private static final int TOTAL_MACHINES = 100;

    @EventListener(ApplicationReadyEvent.class)
    public void initializeData() {
        log.info("Starting data initialization...");

        // 1. Seed Users if none exist
        if (userRepository.count() == 0) {
            log.info("Creating mock users...");
            
            // Create Maintenance Technicians
            userService.createUserDTO(UserDTO.builder()
                    .name("Jo\u00E3o Neves")
                    .email("joao.neves@example.com")
                    .role(UserRole.TECHNICIAN)
                    .password("password")
                    .build());
            
            userService.createUserDTO(UserDTO.builder()
                    .name("Ana Costa")
                    .email("ana.costa@example.com")
                    .role(UserRole.TECHNICIAN)
                    .password("password")
                    .build());

            // Create Maintenance Director
            userService.createUserDTO(UserDTO.builder()
                    .name("Manuel Gomes")
                    .email("manuel.gomes@example.com")
                    .role(UserRole.DIRECTOR)
                    .password("password")
                    .build());

            // Create Administrator (Sara Lopes)
            userService.createUserDTO(UserDTO.builder()
                    .name("Sara Lopes")
                    .email("sara.lopes@example.com")
                    .role(UserRole.ADMIN)
                    .password("password")
                    .build());
            
            log.info("\u2713 Mock users created!");
        }

        // 2. Seed Machines if none exist
        if (machineRepository.count() > 0) {
            log.info("Machines already exist in database, skipping machine initialization");
            return;
        }

        try {
            // Create machines
            log.info("Creating {} machines...", TOTAL_MACHINES);
            long startTime = System.currentTimeMillis();

            // Find João Neves to assign some machines
            User joao = userRepository.findByEmail("joao.neves@example.com").orElse(null);

            String[] realisticNames = {
                "Compressor Unit A1", "Hydraulic Press B2", "CNC Machine C3", 
                "Conveyor System D1", "Cooling Tower E2", "Turbine F1",
                "Industrial Oven G1", "Packaging Robot H2", "Generator Unit I1", "Mixer Tank J3"
            };

            for (int i = 1; i <= TOTAL_MACHINES; i++) {
                String name = (i <= realisticNames.length) ? realisticNames[i-1] : "Machine " + i;
                
                MachineDTO machineDTO = MachineDTO.builder()
                        .name(name)
                        .location("Production Floor - Section " + ((i - 1) / 10 + 1))
                        .importanceLevel((i % 5) + 1)
                        .status(MachineStatus.ACTIVE)
                        .downtimeSum(0.0)
                        .suspicionFlag(false)
                        .vibrationSensor(true)
                        .temperatureSensor(true)
                        .pressureSensor(true)
                        .build();

                MachineDTO created = machineService.createMachineDTO(machineDTO);

                // Assign first 10 machines to Jo\u00E3o Neves if he exists
                if (joao != null && i <= 10) {
                    machineService.assignTechnicianDTO(created.getId(), joao.getId());
                }

                if (i % 20 == 0) {
                    log.debug("Created {} machines so far...", i);
                }
            }

            long machineCreationTime = System.currentTimeMillis() - startTime;
            log.info("\u2713 Created {} machines in {}ms", TOTAL_MACHINES, machineCreationTime);
            log.info("\u2713 Data initialization complete! Machines ready for sensor data from sensor_publisher.py");

        } catch (Exception e) {
            log.error("Error during data initialization", e);
            throw new RuntimeException("Data initialization failed", e);
        }
    }
}
