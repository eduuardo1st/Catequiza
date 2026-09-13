package com.catequiza.admin.domain;

import com.catequiza.admin.controllers.dto.DadosAtualizacaoMatricula;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "matricula_turma")
public class MatriculaTurma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "catequizando_matricula", nullable = false)
    private Catequizando catequizando;

    @ManyToOne
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;

    @Column(name = "status_matricula", nullable = false)
    private String statusMatricula;

    public MatriculaTurma() {
    }

    public MatriculaTurma(Catequizando catequizando, Turma turma, String statusMatricula) {
        this.catequizando = catequizando;
        this.turma = turma;
        this.statusMatricula = statusMatricula;
    }

    public void atualizarInformacoes(DadosAtualizacaoMatricula dados) {
        this.statusMatricula = dados.statusMatricula();
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

    public Turma getTurma() {
        return turma;
    }

    public void setTurma(Turma turma) {
        this.turma = turma;
    }

    public String getStatusMatricula() {
        return statusMatricula;
    }

    public void setStatusMatricula(String statusMatricula) {
        this.statusMatricula = statusMatricula;
    }
}
