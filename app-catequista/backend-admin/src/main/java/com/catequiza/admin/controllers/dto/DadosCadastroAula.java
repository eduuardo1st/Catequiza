package com.catequiza.admin.controllers.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record DadosCadastroAula(
        @NotNull Long idTurma,
        @NotNull LocalDate data,
        String descricaoConteudo,
        Integer minutosValidade
) {
    public DadosCadastroAula(Long idTurma, LocalDate data, String descricaoConteudo) {
        this(idTurma, data, descricaoConteudo, null);
    }
}
