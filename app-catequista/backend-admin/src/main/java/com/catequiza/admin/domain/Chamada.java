package com.catequiza.admin.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "chamada", uniqueConstraints = @UniqueConstraint(name = "uq_chamada_aula_aluno", columnNames = {"aula_id", "catequizando_matricula"}))
public class Chamada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "aula_id", nullable = false)
    private Aula aula;

    @ManyToOne
    @JoinColumn(name = "catequizando_matricula", nullable = false)
    private Catequizando catequizando;

    @Column(name = "presente", nullable = false)
    private Boolean presente;

    public Chamada() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Aula getAula() {
        return aula;
    }

    public void setAula(Aula aula) {
        this.aula = aula;
    }

    public Catequizando getCatequizando() {
        return catequizando;
    }

    public void setCatequizando(Catequizando catequizando) {
        this.catequizando = catequizando;
    }

    public Boolean getPresente() {
        return presente;
    }

    public void setPresente(Boolean presente) {
        this.presente = presente;
    }
}
