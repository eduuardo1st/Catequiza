package com.catequiza.admin.controllers.dto;

import jakarta.validation.constraints.NotNull;

public record DadosRegistroPresenca(
        @NotNull Long idAula,
        @NotNull Long matriculaCatequizando,
        @NotNull Boolean presente
) {
}
