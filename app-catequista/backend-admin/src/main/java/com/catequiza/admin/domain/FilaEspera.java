package com.catequiza.admin.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "fila_espera")
public class FilaEspera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "catequizando_matricula", nullable = false)
    private Catequizando catequizando;

    @Column(name = "sacramento_desejado", nullable = false)
    private String sacramentoDesejado;

    @Column(name = "data_solicitacao", nullable = false)
    private LocalDate dataSolicitacao;

    @Column(name = "status", nullable = false)
    private String status;

    public FilaEspera() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Catequizando getCatequizando() {
        return catequizando;
    }

    public void setCatequizando(Catequizando catequizando) {
        this.catequizando = catequizando;
    }

    public String getSacramentoDesejado() {
        return sacramentoDesejado;
    }

    public void setSacramentoDesejado(String sacramentoDesejado) {
        this.sacramentoDesejado = sacramentoDesejado;
    }

    public LocalDate getDataSolicitacao() {
        return dataSolicitacao;
    }

    public void setDataSolicitacao(LocalDate dataSolicitacao) {
        this.dataSolicitacao = dataSolicitacao;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
