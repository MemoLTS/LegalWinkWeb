package com.gateway.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "EcoMarket - API Gateway",
        version = "1.0",
        description = "Punto de entrada único a todos los microservicios del sistema EcoMarket. Selecciona un servicio en el desplegable de arriba para ver su documentación."
    ),
    servers = @Server(url = "http://localhost:8080", description = "Gateway local")
)
public class OpenApiConfig {

}
