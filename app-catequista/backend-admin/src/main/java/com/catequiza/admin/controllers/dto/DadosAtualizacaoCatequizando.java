package com.catequiza.admin.controllers.dto;

import jakarta.validation.constraints.NotNull;

public record DadosAtualizacaoCatequizando(
        @NotNull Long matricula,
        String nome,
        String telefone,
        String email
) {
}
