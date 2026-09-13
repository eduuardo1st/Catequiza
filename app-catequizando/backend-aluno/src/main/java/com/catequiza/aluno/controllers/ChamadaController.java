package com.catequiza.aluno.controllers;

import com.catequiza.aluno.controllers.dto.DadosRegistroChamada;
import com.catequiza.aluno.domain.Chamada;
import com.catequiza.aluno.repositories.AulaRepository;
import com.catequiza.aluno.repositories.CatequizandoRepository;
import com.catequiza.aluno.repositories.ChamadaRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/chamadas")
@CrossOrigin(origins = "*")
public class ChamadaController {

    private final AulaRepository aulaRepository;
    private final CatequizandoRepository catequizandoRepository;
    private final ChamadaRepository chamadaRepository;

    public ChamadaController(AulaRepository aulaRepository, CatequizandoRepository catequizandoRepository, ChamadaRepository chamadaRepository) {
        this.aulaRepository = aulaRepository;
        this.catequizandoRepository = catequizandoRepository;
        this.chamadaRepository = chamadaRepository;
    }

    @PostMapping
    public ResponseEntity<String> registrar(@RequestBody @Valid DadosRegistroChamada dados) {
        var aula = aulaRepository.findByPin(dados.pin())
                .orElseThrow(() -> new RuntimeException("PIN inválido ou aula não encontrada"));

        if (LocalDateTime.now().isAfter(aula.getHorarioExpiracao())) {
            throw new RuntimeException("PIN expirado");
        }

        var catequizando = catequizandoRepository.findById(dados.matriculaCatequizando())
                .orElseThrow(() -> new RuntimeException("Matrícula não encontrada"));

        if (chamadaRepository.existsByAulaAndCatequizando(aula, catequizando)) {
            throw new RuntimeException("Presença já registrada para este aluno nesta aula");
        }

        var chamada = new Chamada(aula, catequizando);
        chamadaRepository.save(chamada);

        return ResponseEntity.ok("Presença registrada com sucesso!");
    }
}
