package com.catequiza.aluno.controllers;

import com.catequiza.aluno.controllers.dto.DadosCadastroFila;
import com.catequiza.aluno.domain.FilaEspera;
import com.catequiza.aluno.repositories.CatequizandoRepository;
import com.catequiza.aluno.repositories.FilaEsperaRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fila-espera")
@CrossOrigin(origins = "*")
public class FilaEsperaController {

    private final FilaEsperaRepository filaEsperaRepository;
    private final CatequizandoRepository catequizandoRepository;

    public FilaEsperaController(FilaEsperaRepository filaEsperaRepository, CatequizandoRepository catequizandoRepository) {
        this.filaEsperaRepository = filaEsperaRepository;
        this.catequizandoRepository = catequizandoRepository;
    }

    @PostMapping
    public ResponseEntity<String> solicitar(@RequestBody @Valid DadosCadastroFila dados) {
        var catequizando = catequizandoRepository.findById(dados.matriculaCatequizando())
                .orElseThrow(() -> new RuntimeException("Catequizando não encontrado"));

        var fila = new FilaEspera(catequizando, dados.sacramentoDesejado());
        filaEsperaRepository.save(fila);

        return ResponseEntity.ok("Solicitação para a fila de espera enviada com sucesso!");
    }
}
