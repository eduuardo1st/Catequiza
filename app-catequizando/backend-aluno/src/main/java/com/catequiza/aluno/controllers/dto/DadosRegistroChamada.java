package com.catequiza.aluno.controllers.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosRegistroChamada(
        @NotBlank String pin,
        @NotNull Long matriculaCatequizando
) {
}
