package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

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
                                .email("g705@ua.pt")))

                .addSecurityItem(
                        new SecurityRequirement()
                                .addList("bearerAuth")
                )

                .components(
                        new Components()
                                .addSecuritySchemes(
                                        "bearerAuth",

                                        new SecurityScheme()
                                                .name("bearerAuth")
                                                .type(SecurityScheme.Type.HTTP)
                                                .scheme("bearer")
                                                .bearerFormat("JWT")
                                )
                );
    }
}