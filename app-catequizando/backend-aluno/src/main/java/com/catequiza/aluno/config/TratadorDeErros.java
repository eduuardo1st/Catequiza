package com.catequiza.aluno.config;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class TratadorDeErros {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, String>> tratarErro404(EntityNotFoundException ex) {
        String msg = ex.getMessage() != null ? ex.getMessage() : "Registro não encontrado.";
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("erro", msg, "message", msg));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> tratarErro400(MethodArgumentNotValidException ex) {
        return ResponseEntity.badRequest()
                .body(Map.of("erro", "Preencha todos os campos obrigatórios corretamente.", "message", "Dados inválidos."));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> tratarErroRegraDeNegocio(RuntimeException ex) {
        String msg = ex.getMessage() != null ? ex.getMessage() : "Erro ao processar solicitação.";
        return ResponseEntity.badRequest()
                .body(Map.of("erro", msg, "message", msg));
    }
}
