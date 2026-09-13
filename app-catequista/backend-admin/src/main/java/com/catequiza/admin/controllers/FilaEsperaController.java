package com.catequiza.admin.controllers;

import com.catequiza.admin.controllers.dto.DadosAtualizacaoFila;
import com.catequiza.admin.controllers.dto.DadosDetalhamentoFila;
import com.catequiza.admin.repositories.FilaEsperaRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/fila-espera")
public class FilaEsperaController {

    private final FilaEsperaRepository filaEsperaRepository;

    public FilaEsperaController(FilaEsperaRepository filaEsperaRepository) {
        this.filaEsperaRepository = filaEsperaRepository;
    }

    @GetMapping
    public ResponseEntity<List<DadosDetalhamentoFila>> listar() {
        var lista = filaEsperaRepository.findAll().stream().map(DadosDetalhamentoFila::new).toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoFila> atualizar(@RequestBody @Valid DadosAtualizacaoFila dados) {
        var fila = filaEsperaRepository.getReferenceById(dados.id());
        fila.atualizarStatus(dados);
        return ResponseEntity.ok(new DadosDetalhamentoFila(fila));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        filaEsperaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
