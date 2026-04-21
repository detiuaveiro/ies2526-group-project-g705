package com.example.dto;

import com.example.domain.enums.SensorType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensorReadingDTO {

    private Long id;

    @NotNull
    private Long machineId;

    @NotNull
    private SensorType sensorType;

    @NotNull
    private Double value;

    @NotNull
    private LocalDateTime recordedAt;
}
