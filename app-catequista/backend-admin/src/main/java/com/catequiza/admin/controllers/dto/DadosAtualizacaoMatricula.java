package com.catequiza.admin.controllers.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosAtualizacaoMatricula(
        @NotNull Long id,
        @NotBlank String statusMatricula
) {
}
