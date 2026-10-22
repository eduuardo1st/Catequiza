package com.catequiza.admin.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;

@Component
public class DatabaseHealthRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseHealthRunner.class);
    private final DataSource dataSource;

    public DatabaseHealthRunner(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            log.info("----------------------------------------------------------------");
            log.info("CONEXAO COM BANCO DE DADOS ESTABELECIDA COM SUCESSO!");
            log.info("Produto: {}", metaData.getDatabaseProductName());
            log.info("Versao: {}", metaData.getDatabaseProductVersion());
            log.info("URL: {}", metaData.getURL());
            log.info("Valido: {}", connection.isValid(2));
            log.info("----------------------------------------------------------------");
        } catch (Exception e) {
            log.error("----------------------------------------------------------------");
            log.error("FALHA NA CONEXAO COM O BANCO DE DADOS: {}", e.getMessage());
            log.error("----------------------------------------------------------------");
        }
    }
}
