package com.catequiza.admin.controllers.dto;

import com.catequiza.admin.domain.Turma;

public record DadosDetalhamentoTurma(Long id, Long idCatequista, String nomeTurma, Integer anoLetivo) {

    public DadosDetalhamentoTurma(Turma turma) {
        this(turma.getId(), turma.getCatequista().getId(), turma.getNomeTurma(), turma.getAnoLetivo());
    }
}
