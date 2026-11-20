package com.catequiza.admin.controllers.dto;

import com.catequiza.admin.domain.Turma;

public record DadosDetalhamentoTurma(
        Long id,
        Long idCatequista,
        String nomeTurma,
        Integer anoLetivo,
        String nomeCatequista
) {

    public DadosDetalhamentoTurma(Long id, Long idCatequista, String nomeTurma, Integer anoLetivo) {
        this(id, idCatequista, nomeTurma, anoLetivo, null);
    }

    public DadosDetalhamentoTurma(Turma turma) {
        this(
                turma.getId(),
                turma.getCatequista() != null ? turma.getCatequista().getId() : null,
                turma.getNomeTurma(),
                turma.getAnoLetivo(),
                turma.getCatequista() != null ? turma.getCatequista().getNome() : null
        );
    }
}
