package com.catequiza.admin.controllers.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record DadosAtualizacaoAula(
        @NotNull Long id,
        LocalDate data,
        String descricaoConteudo
) {
}
