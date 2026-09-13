package com.catequiza.admin.controllers.dto;

import jakarta.validation.constraints.NotNull;

public record DadosAtualizacaoTurma(
        @NotNull Long id,
        String nomeTurma,
        Integer anoLetivo
) {
}
