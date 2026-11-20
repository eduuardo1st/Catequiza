package com.catequiza.admin.controllers.dto;

import com.catequiza.admin.domain.Chamada;

public record DadosDetalhamentoChamada(
        Long id,
        Long idAula,
        Long idTurma,
        Long matriculaCatequizando,
        String nomeCatequizando,
        Boolean presente
) {
    public DadosDetalhamentoChamada(Chamada chamada) {
        this(
                chamada.getId(),
                chamada.getAula() != null ? chamada.getAula().getId() : null,
                chamada.getAula() != null && chamada.getAula().getTurma() != null
                        ? chamada.getAula().getTurma().getId()
                        : null,
                chamada.getCatequizando() != null ? chamada.getCatequizando().getMatricula() : null,
                chamada.getCatequizando() != null ? chamada.getCatequizando().getNome() : null,
                chamada.getPresente()
        );
    }
}
