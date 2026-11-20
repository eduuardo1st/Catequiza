package com.catequiza.admin.controllers.dto;

import com.catequiza.admin.domain.FilaEspera;
import java.time.LocalDate;

public record DadosDetalhamentoFila(
        Long id,
        Long matriculaCatequizando,
        String sacramentoDesejado,
        LocalDate dataSolicitacao,
        String status,
        String nomeCatequizando,
        String cpfCatequizando,
        String telefoneCatequizando
) {

    public DadosDetalhamentoFila(Long id, Long matriculaCatequizando, String sacramentoDesejado, LocalDate dataSolicitacao, String status) {
        this(id, matriculaCatequizando, sacramentoDesejado, dataSolicitacao, status, null, null, null);
    }

    public DadosDetalhamentoFila(FilaEspera fila) {
        this(
                fila.getId(),
                fila.getCatequizando() != null ? fila.getCatequizando().getMatricula() : null,
                fila.getSacramentoDesejado(),
                fila.getDataSolicitacao(),
                fila.getStatus(),
                fila.getCatequizando() != null ? fila.getCatequizando().getNome() : null,
                fila.getCatequizando() != null ? fila.getCatequizando().getCpf() : null,
                fila.getCatequizando() != null ? fila.getCatequizando().getTelefone() : null
        );
    }
}
