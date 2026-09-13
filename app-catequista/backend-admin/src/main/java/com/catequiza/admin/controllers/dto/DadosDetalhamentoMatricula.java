package com.catequiza.admin.controllers.dto;

import com.catequiza.admin.domain.MatriculaTurma;

public record DadosDetalhamentoMatricula(Long id, Long matriculaCatequizando, Long idTurma, String statusMatricula) {

    public DadosDetalhamentoMatricula(MatriculaTurma matricula) {
        this(matricula.getId(), matricula.getCatequizando().getMatricula(), matricula.getTurma().getId(), matricula.getStatusMatricula());
    }
}
