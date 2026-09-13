package com.catequiza.admin.controllers.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosAtualizacaoFila(
        @NotNull Long id,
        @NotBlank String status
) {
}
