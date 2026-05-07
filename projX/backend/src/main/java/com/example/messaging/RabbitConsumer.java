package com.example.messaging;

import com.example.config.RabbitMQConfig;
import com.example.dto.SensorReadingDTO;
import com.example.service.SensorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Component;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class    RabbitConsumer {

    private final SensorService sensorService;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = RabbitMQConfig.SENSOR_READINGS_QUEUE)
    public void handle(String message) {
        try {
            SensorReadingDTO dto = objectMapper.readValue(message, SensorReadingDTO.class);
            sensorService.createReading(dto);
            System.out.println("[RabbitConsumer] Stored reading: " + message);
        } catch (EntityNotFoundException | DataAccessException exception) {
            System.err.println("[RabbitConsumer] Failed to persist reading: " + exception.getMessage());
            throw exception;
        } catch (Exception exception) {
            System.err.println("[RabbitConsumer] Invalid message payload: " + message);
            throw new IllegalArgumentException("Invalid sensor reading payload", exception);
        }
    }
}
