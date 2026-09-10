package com.catequiza.aluno.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "aula")
public class Aula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;

    @Column(name = "data", nullable = false)
    private LocalDate data;

    @Column(name = "pin")
    private String pin;

    @Column(name = "horario_expiracao")
    private LocalDateTime horarioExpiracao;

    @Column(name = "descricao_conteudo")
    private String descricaoConteudo;

    public Aula() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Turma getTurma() {
        return turma;
    }

    public void setTurma(Turma turma) {
        this.turma = turma;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public LocalDateTime getHorarioExpiracao() {
        return horarioExpiracao;
    }

    public void setHorarioExpiracao(LocalDateTime horarioExpiracao) {
        this.horarioExpiracao = horarioExpiracao;
    }

    public String getDescricaoConteudo() {
        return descricaoConteudo;
    }

    public void setDescricaoConteudo(String descricaoConteudo) {
        this.descricaoConteudo = descricaoConteudo;
    }
}
