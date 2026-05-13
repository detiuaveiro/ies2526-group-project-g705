package com.example.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String SENSOR_READINGS_QUEUE = "my.queue";

    /**
     * Declare a durable queue named "my.queue" so it persists in RabbitMQ.
     */
    @Bean
    public Queue myQueue() {
        return new Queue(SENSOR_READINGS_QUEUE, true);
    }
}
