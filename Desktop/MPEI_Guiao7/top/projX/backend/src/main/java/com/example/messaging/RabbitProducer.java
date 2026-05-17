package com.example.messaging;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class RabbitProducer {
    private final RabbitTemplate rabbitTemplate;

    public RabbitProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * Send a message to the default exchange with the given routing key / queue name.
     */
    public void send(String routingKey, Object payload) {
        rabbitTemplate.convertAndSend(routingKey, payload);
    }
}
