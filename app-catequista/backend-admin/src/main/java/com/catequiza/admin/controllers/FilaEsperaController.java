package com.catequiza.admin.controllers;

import com.catequiza.admin.controllers.dto.DadosAtualizacaoFila;
import com.catequiza.admin.controllers.dto.DadosCadastroFila;
import com.catequiza.admin.controllers.dto.DadosDetalhamentoFila;
import com.catequiza.admin.domain.FilaEspera;
import com.catequiza.admin.repositories.CatequizandoRepository;
import com.catequiza.admin.repositories.FilaEsperaRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/fila-espera")
public class FilaEsperaController {

    private final FilaEsperaRepository filaEsperaRepository;
    private final CatequizandoRepository catequizandoRepository;

    public FilaEsperaController(
            FilaEsperaRepository filaEsperaRepository,
            CatequizandoRepository catequizandoRepository
    ) {
        this.filaEsperaRepository = filaEsperaRepository;
        this.catequizandoRepository = catequizandoRepository;
    }

    @GetMapping
    public ResponseEntity<List<DadosDetalhamentoFila>> listar() {
        var lista = filaEsperaRepository.findAll().stream().map(DadosDetalhamentoFila::new).toList();
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoFila> cadastrar(@RequestBody @Valid DadosCadastroFila dados, UriComponentsBuilder uriBuilder) {
        var catequizando = catequizandoRepository.findById(dados.matriculaCatequizando())
                .orElseThrow(() -> new EntityNotFoundException("Catequizando não encontrado com matrícula " + dados.matriculaCatequizando()));

        var fila = new FilaEspera(catequizando, dados.sacramentoDesejado());
        filaEsperaRepository.save(fila);

        var uri = uriBuilder.path("/fila-espera/{id}").buildAndExpand(fila.getId()).toUri();
        return ResponseEntity.created(uri).body(new DadosDetalhamentoFila(fila));
    }

    @PutMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoFila> atualizar(@RequestBody @Valid DadosAtualizacaoFila dados) {
        var fila = filaEsperaRepository.findById(dados.id())
                .orElseThrow(() -> new EntityNotFoundException("Solicitação da fila não encontrada com ID " + dados.id()));
        fila.atualizarStatus(dados);
        return ResponseEntity.ok(new DadosDetalhamentoFila(fila));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        filaEsperaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
