package com.catequiza.admin.controllers.dto;

import com.catequiza.admin.domain.Catequizando;

public record DadosDetalhamentoCatequizando(Long matricula, String cpf, String nome, String telefone, String email) {

    public DadosDetalhamentoCatequizando(Catequizando catequizando) {
        this(catequizando.getMatricula(), catequizando.getCpf(), catequizando.getNome(), catequizando.getTelefone(), catequizando.getEmail());
    }
}
