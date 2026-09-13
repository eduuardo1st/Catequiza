package com.catequiza.admin.controllers.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosCadastroMatricula(
        @NotNull Long matriculaCatequizando,
        @NotNull Long idTurma,
        @NotBlank String statusMatricula
) {
}
