package com.catequiza.admin.controllers.dto;

import com.catequiza.admin.domain.Aula;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record DadosDetalhamentoAula(Long id, Long idTurma, LocalDate data, String pin, LocalDateTime horarioExpiracao, String descricaoConteudo) {

    public DadosDetalhamentoAula(Aula aula) {
        this(aula.getId(), aula.getTurma().getId(), aula.getData(), aula.getPin(), aula.getHorarioExpiracao(), aula.getDescricaoConteudo());
    }
}
