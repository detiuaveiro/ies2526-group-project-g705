package com.example.messaging;

import com.example.config.RabbitMQConfig;
import com.example.dto.SensorReadingDTO;
import com.example.service.SensorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class RabbitConsumer {

    private final SensorService sensorService;
    private final ObjectMapper objectMapper;

    @Autowired
    public RabbitConsumer(SensorService sensorService, ObjectMapper objectMapper) {
        this.sensorService = sensorService;
        this.objectMapper = objectMapper;
        System.out.println(">>>>>> RABBIT CONSUMER FOI CARREGADO COM SUCESSO <<<<<<");
    }

    @RabbitListener(queues = RabbitMQConfig.SENSOR_READINGS_QUEUE)
    public void handle(String message) {
        System.out.println("DEBUG: Mensagem recebida do RabbitMQ -> " + message);
        
        try {
            SensorReadingDTO dto = objectMapper.readValue(message, SensorReadingDTO.class);
            sensorService.createReading(dto);
            System.out.println("[RabbitConsumer] Stored reading for machine: " + dto.getMachineId());
        } catch (Exception exception) {
            System.err.println("[RabbitConsumer] Erro ao processar: " + exception.getMessage());
            exception.printStackTrace();
        }
    }
}