package com.catequiza.admin.controllers.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosCadastroTurma(
        @NotNull Long idCatequista,
        @NotBlank String nomeTurma,
        @NotNull Integer anoLetivo
) {
}
