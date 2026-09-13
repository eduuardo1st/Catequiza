package com.catequiza.admin.controllers.dto;

import com.catequiza.admin.domain.FilaEspera;
import java.time.LocalDate;

public record DadosDetalhamentoFila(Long id, Long matriculaCatequizando, String sacramentoDesejado, LocalDate dataSolicitacao, String status) {

    public DadosDetalhamentoFila(FilaEspera fila) {
        this(fila.getId(), fila.getCatequizando().getMatricula(), fila.getSacramentoDesejado(), fila.getDataSolicitacao(), fila.getStatus());
    }
}
