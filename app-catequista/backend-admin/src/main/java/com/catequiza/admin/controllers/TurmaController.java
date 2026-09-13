package com.catequiza.admin.controllers;

import com.catequiza.admin.controllers.dto.DadosCadastroTurma;
import com.catequiza.admin.controllers.dto.DadosAtualizacaoTurma;
import com.catequiza.admin.controllers.dto.DadosDetalhamentoTurma;
import com.catequiza.admin.domain.Catequista;
import com.catequiza.admin.domain.Turma;
import com.catequiza.admin.repositories.CatequistaRepository;
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
@RequestMapping("/turmas")
public class TurmaController {

    private final TurmaRepository turmaRepository;
    private final CatequistaRepository catequistaRepository;

    public TurmaController(TurmaRepository turmaRepository, CatequistaRepository catequistaRepository) {
        this.turmaRepository = turmaRepository;
        this.catequistaRepository = catequistaRepository;
    }

    @PostMapping
    public ResponseEntity<DadosDetalhamentoTurma> cadastrar(@RequestBody @Valid DadosCadastroTurma dados, UriComponentsBuilder uriBuilder) {
        var catequista = catequistaRepository.findById(dados.idCatequista())
                .orElseThrow(() -> new RuntimeException("Catequista não encontrado"));

        var turma = new Turma(dados, catequista);
        turmaRepository.save(turma);

        var uri = uriBuilder.path("/turmas/{id}").buildAndExpand(turma.getId()).toUri();
        return ResponseEntity.created(uri).body(new DadosDetalhamentoTurma(turma));
    }

    @GetMapping
    public ResponseEntity<List<DadosDetalhamentoTurma>> listar() {
        var lista = turmaRepository.findAll().stream().map(DadosDetalhamentoTurma::new).toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosDetalhamentoTurma> detalhar(@PathVariable Long id) {
        var turma = turmaRepository.getReferenceById(id);
        return ResponseEntity.ok(new DadosDetalhamentoTurma(turma));
    }

    @PutMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoTurma> atualizar(@RequestBody @Valid DadosAtualizacaoTurma dados) {
        var turma = turmaRepository.getReferenceById(dados.id());
        turma.atualizarInformacoes(dados);
        return ResponseEntity.ok(new DadosDetalhamentoTurma(turma));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        turmaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
