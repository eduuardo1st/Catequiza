package com.catequiza.admin.controllers;

import com.catequiza.admin.controllers.dto.DadosDetalhamentoCatequista;
import com.catequiza.admin.repositories.CatequistaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/catequistas")
public class CatequistaController {

    private final CatequistaRepository catequistaRepository;

    public CatequistaController(CatequistaRepository catequistaRepository) {
        this.catequistaRepository = catequistaRepository;
    }

    @GetMapping
    public ResponseEntity<List<DadosDetalhamentoCatequista>> listar() {
        var lista = catequistaRepository.findAll().stream()
                .map(DadosDetalhamentoCatequista::new)
                .toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosDetalhamentoCatequista> detalhar(@PathVariable Long id) {
        var catequista = catequistaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Catequista não encontrado com ID " + id));
        return ResponseEntity.ok(new DadosDetalhamentoCatequista(catequista));
    }
}
