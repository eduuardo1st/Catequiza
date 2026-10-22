package com.catequiza.admin.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
@Tag(name = "Health", description = "Verificação de integridade e status da conexão com o banco de dados")
public class HealthController {

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping
    @Operation(summary = "Verifica se a API e o banco de dados estão operacionais")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("timestamp", Instant.now().toString());

        try (Connection connection = dataSource.getConnection()) {
            boolean isValid = connection.isValid(2);
            DatabaseMetaData metaData = connection.getMetaData();

            Map<String, Object> dbInfo = new LinkedHashMap<>();
            dbInfo.put("connected", isValid);
            dbInfo.put("product", metaData.getDatabaseProductName());
            dbInfo.put("version", metaData.getDatabaseProductVersion());
            dbInfo.put("url", metaData.getURL());

            response.put("database", dbInfo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> dbError = new LinkedHashMap<>();
            dbError.put("connected", false);
            dbError.put("error", e.getMessage());

            response.put("status", "DOWN");
            response.put("database", dbError);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }
}
