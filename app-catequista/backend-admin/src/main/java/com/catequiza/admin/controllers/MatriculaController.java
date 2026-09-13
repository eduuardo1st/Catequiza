package com.catequiza.admin.controllers;

import com.catequiza.admin.controllers.dto.DadosCadastroMatricula;
import com.catequiza.admin.controllers.dto.DadosAtualizacaoMatricula;
import com.catequiza.admin.controllers.dto.DadosDetalhamentoMatricula;
import com.catequiza.admin.domain.MatriculaTurma;
import com.catequiza.admin.repositories.CatequizandoRepository;
import com.catequiza.admin.repositories.MatriculaTurmaRepository;
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
@RequestMapping("/matriculas")
public class MatriculaController {

    private final MatriculaTurmaRepository matriculaTurmaRepository;
    private final CatequizandoRepository catequizandoRepository;
    private final TurmaRepository turmaRepository;

    public MatriculaController(MatriculaTurmaRepository matriculaTurmaRepository, CatequizandoRepository catequizandoRepository, TurmaRepository turmaRepository) {
        this.matriculaTurmaRepository = matriculaTurmaRepository;
        this.catequizandoRepository = catequizandoRepository;
        this.turmaRepository = turmaRepository;
    }

    @PostMapping
    public ResponseEntity<DadosDetalhamentoMatricula> cadastrar(@RequestBody @Valid DadosCadastroMatricula dados, UriComponentsBuilder uriBuilder) {
        var catequizando = catequizandoRepository.findById(dados.matriculaCatequizando())
                .orElseThrow(() -> new RuntimeException("Catequizando não encontrado"));

        var turma = turmaRepository.findById(dados.idTurma())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        var matricula = new MatriculaTurma(catequizando, turma, dados.statusMatricula());
        matriculaTurmaRepository.save(matricula);

        var uri = uriBuilder.path("/matriculas/{id}").buildAndExpand(matricula.getId()).toUri();
        return ResponseEntity.created(uri).body(new DadosDetalhamentoMatricula(matricula));
    }

    @GetMapping
    public ResponseEntity<List<DadosDetalhamentoMatricula>> listar() {
        var lista = matriculaTurmaRepository.findAll().stream().map(DadosDetalhamentoMatricula::new).toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosDetalhamentoMatricula> detalhar(@PathVariable Long id) {
        var matricula = matriculaTurmaRepository.getReferenceById(id);
        return ResponseEntity.ok(new DadosDetalhamentoMatricula(matricula));
    }

    @PutMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoMatricula> atualizar(@RequestBody @Valid DadosAtualizacaoMatricula dados) {
        var matricula = matriculaTurmaRepository.getReferenceById(dados.id());
        matricula.atualizarInformacoes(dados);
        return ResponseEntity.ok(new DadosDetalhamentoMatricula(matricula));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        matriculaTurmaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
