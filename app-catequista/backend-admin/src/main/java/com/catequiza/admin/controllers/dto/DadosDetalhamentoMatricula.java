package com.catequiza.admin.controllers.dto;

import com.catequiza.admin.domain.MatriculaTurma;

public record DadosDetalhamentoMatricula(
        Long id,
        Long matriculaCatequizando,
        Long idTurma,
        String statusMatricula,
        String nomeCatequizando,
        String cpfCatequizando,
        String nomeTurma,
        Integer anoLetivoTurma
) {

    public DadosDetalhamentoMatricula(Long id, Long matriculaCatequizando, Long idTurma, String statusMatricula) {
        this(id, matriculaCatequizando, idTurma, statusMatricula, null, null, null, null);
    }

    public DadosDetalhamentoMatricula(MatriculaTurma matricula) {
        this(
                matricula.getId(),
                matricula.getCatequizando() != null ? matricula.getCatequizando().getMatricula() : null,
                matricula.getTurma() != null ? matricula.getTurma().getId() : null,
                matricula.getStatusMatricula(),
                matricula.getCatequizando() != null ? matricula.getCatequizando().getNome() : null,
                matricula.getCatequizando() != null ? matricula.getCatequizando().getCpf() : null,
                matricula.getTurma() != null ? matricula.getTurma().getNomeTurma() : null,
                matricula.getTurma() != null ? matricula.getTurma().getAnoLetivo() : null
        );
    }
}
