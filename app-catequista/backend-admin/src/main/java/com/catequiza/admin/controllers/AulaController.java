package com.catequiza.admin.controllers;

import com.catequiza.admin.controllers.dto.DadosCadastroAula;
import com.catequiza.admin.controllers.dto.DadosAtualizacaoAula;
import com.catequiza.admin.controllers.dto.DadosDetalhamentoAula;
import com.catequiza.admin.domain.Aula;
import com.catequiza.admin.repositories.AulaRepository;
import com.catequiza.admin.repositories.TurmaRepository;
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
@RequestMapping("/aulas")
public class AulaController {

    private final AulaRepository aulaRepository;
    private final TurmaRepository turmaRepository;

    public AulaController(AulaRepository aulaRepository, TurmaRepository turmaRepository) {
        this.aulaRepository = aulaRepository;
        this.turmaRepository = turmaRepository;
    }

    @PostMapping
    public ResponseEntity<DadosDetalhamentoAula> cadastrar(@RequestBody @Valid DadosCadastroAula dados, UriComponentsBuilder uriBuilder) {
        var turma = turmaRepository.findById(dados.idTurma())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        var aula = new Aula(dados, turma);
        aulaRepository.save(aula);

        var uri = uriBuilder.path("/aulas/{id}").buildAndExpand(aula.getId()).toUri();
        return ResponseEntity.created(uri).body(new DadosDetalhamentoAula(aula));
    }

    @GetMapping
    public ResponseEntity<List<DadosDetalhamentoAula>> listar() {
        var lista = aulaRepository.findAll().stream().map(DadosDetalhamentoAula::new).toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosDetalhamentoAula> detalhar(@PathVariable Long id) {
        var aula = aulaRepository.getReferenceById(id);
        return ResponseEntity.ok(new DadosDetalhamentoAula(aula));
    }

    @PutMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoAula> atualizar(@RequestBody @Valid DadosAtualizacaoAula dados) {
        var aula = aulaRepository.getReferenceById(dados.id());
        aula.atualizarInformacoes(dados);
        return ResponseEntity.ok(new DadosDetalhamentoAula(aula));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        aulaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
