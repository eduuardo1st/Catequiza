package com.catequiza.aluno.controllers.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosCadastroFila(
        @NotNull Long matriculaCatequizando,
        @NotBlank String sacramentoDesejado
) {
}
