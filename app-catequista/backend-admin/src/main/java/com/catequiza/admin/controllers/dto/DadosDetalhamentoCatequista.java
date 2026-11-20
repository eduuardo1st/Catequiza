package com.catequiza.admin.controllers.dto;

import com.catequiza.admin.domain.Catequista;

public record DadosDetalhamentoCatequista(
        Long id,
        String nome,
        String email,
        String telefone
) {
    public DadosDetalhamentoCatequista(Catequista catequista) {
        this(catequista.getId(), catequista.getNome(), catequista.getEmail(), catequista.getTelefone());
    }
}
