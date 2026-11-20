package com.catequiza.admin.controllers;

import com.catequiza.admin.controllers.dto.DadosDetalhamentoChamada;
import com.catequiza.admin.controllers.dto.DadosRegistroPresenca;
import com.catequiza.admin.domain.Chamada;
import com.catequiza.admin.repositories.AulaRepository;
import com.catequiza.admin.repositories.CatequizandoRepository;
import com.catequiza.admin.repositories.ChamadaRepository;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/chamadas")
public class ChamadaController {

    private final ChamadaRepository chamadaRepository;
    private final AulaRepository aulaRepository;
    private final CatequizandoRepository catequizandoRepository;

    public ChamadaController(
            ChamadaRepository chamadaRepository,
            AulaRepository aulaRepository,
            CatequizandoRepository catequizandoRepository
    ) {
        this.chamadaRepository = chamadaRepository;
        this.aulaRepository = aulaRepository;
        this.catequizandoRepository = catequizandoRepository;
    }

    @GetMapping
    public ResponseEntity<List<DadosDetalhamentoChamada>> listar(
            @RequestParam(required = false) Long turmaId,
            @RequestParam(required = false) Long aulaId,
            @RequestParam(required = false) Long matriculaCatequizando
    ) {
        List<Chamada> chamadas;
        if (aulaId != null) {
            chamadas = chamadaRepository.findByAulaId(aulaId);
        } else if (turmaId != null) {
            chamadas = chamadaRepository.findByAulaTurmaId(turmaId);
        } else if (matriculaCatequizando != null) {
            chamadas = chamadaRepository.findByCatequizandoMatricula(matriculaCatequizando);
        } else {
            chamadas = chamadaRepository.findAll();
        }
        return ResponseEntity.ok(chamadas.stream().map(DadosDetalhamentoChamada::new).toList());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoChamada> registrarOuAtualizar(@RequestBody @Valid DadosRegistroPresenca dados) {
        var aula = aulaRepository.findById(dados.idAula())
                .orElseThrow(() -> new EntityNotFoundException("Aula não encontrada com ID " + dados.idAula()));

        var catequizando = catequizandoRepository.findById(dados.matriculaCatequizando())
                .orElseThrow(() -> new EntityNotFoundException("Catequizando não encontrado com matrícula " + dados.matriculaCatequizando()));

        var existente = chamadaRepository.findByAulaIdAndCatequizandoMatricula(dados.idAula(), dados.matriculaCatequizando());
        Chamada chamada;
        if (existente.isPresent()) {
            chamada = existente.get();
            chamada.setPresente(dados.presente());
        } else {
            chamada = new Chamada(aula, catequizando, dados.presente());
            chamadaRepository.save(chamada);
        }

        return ResponseEntity.ok(new DadosDetalhamentoChamada(chamada));
    }

    @PutMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoChamada> atualizar(@RequestBody @Valid DadosRegistroPresenca dados) {
        return registrarOuAtualizar(dados);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        chamadaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
