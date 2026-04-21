package com.example.dto;

import com.example.domain.enums.MachineStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MachineDTO {

    private Long id;

    @NotBlank
    private String name;

    private String location;

    private Integer importanceLevel;

    @NotNull
    private MachineStatus status;

    private Double downtimeSum;
    private boolean suspicionFlag;
}
