package com.example.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI maintenanceSystemOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Maintenance Management System API")
                        .description("REST API for managing machines, technicians, problems, maintenance tasks, assistance requests and sensor readings.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Group G705")
                                .email("g705@ua.pt")));
    }
}
