package com.catequiza.admin.controllers.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosCadastroFila(
        @NotNull Long matriculaCatequizando,
        @NotBlank String sacramentoDesejado
) {
}
