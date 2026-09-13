package com.catequiza.admin.controllers;

import com.catequiza.admin.controllers.dto.DadosCadastroCatequizando;
import com.catequiza.admin.controllers.dto.DadosAtualizacaoCatequizando;
import com.catequiza.admin.controllers.dto.DadosDetalhamentoCatequizando;
import com.catequiza.admin.domain.Catequizando;
import com.catequiza.admin.repositories.CatequizandoRepository;
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
@RequestMapping("/catequizandos")
public class CatequizandoController {

    private final CatequizandoRepository repository;

    public CatequizandoController(CatequizandoRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<DadosDetalhamentoCatequizando> cadastrar(@RequestBody @Valid DadosCadastroCatequizando dados, UriComponentsBuilder uriBuilder) {
        Catequizando catequizando = new Catequizando(dados);
        repository.save(catequizando);

        var uri = uriBuilder.path("/catequizandos/{matricula}").buildAndExpand(catequizando.getMatricula()).toUri();
        return ResponseEntity.created(uri).body(new DadosDetalhamentoCatequizando(catequizando));
    }

    @GetMapping
    public ResponseEntity<List<DadosDetalhamentoCatequizando>> listar() {
        var lista = repository.findAll().stream().map(DadosDetalhamentoCatequizando::new).toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{matricula}")
    public ResponseEntity<DadosDetalhamentoCatequizando> detalhar(@PathVariable Long matricula) {
        var catequizando = repository.getReferenceById(matricula);
        return ResponseEntity.ok(new DadosDetalhamentoCatequizando(catequizando));
    }

    @PutMapping
    @Transactional
    public ResponseEntity<DadosDetalhamentoCatequizando> atualizar(@RequestBody @Valid DadosAtualizacaoCatequizando dados) {
        var catequizando = repository.getReferenceById(dados.matricula());
        catequizando.atualizarInformacoes(dados);
        return ResponseEntity.ok(new DadosDetalhamentoCatequizando(catequizando));
    }

    @DeleteMapping("/{matricula}")
    public ResponseEntity<Void> excluir(@PathVariable Long matricula) {
        repository.deleteById(matricula);
        return ResponseEntity.noContent().build();
    }
}
