package com.catequiza.admin.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

/**
 * Registro de presenca/falta de um catequizando em uma data de aula.
 * Mapeamento espelhado de forma identica nos dois back-ends
 * (app-catequista/backend-admin e app-catequizando/backend-aluno).
 */
@Entity
@Table(name = "presenca",
		uniqueConstraints = @UniqueConstraint(name = "uq_presenca_catequizando_data",
				columnNames = { "catequizando_id", "data_aula" }))
public class Presenca {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "catequizando_id")
	private Catequizando catequizando;

	@Column(name = "data_aula", nullable = false)
	private LocalDate dataAula;

	@Column(nullable = false)
	private boolean presente;

	protected Presenca() {
		// exigido pelo JPA
	}

	public Presenca(Catequizando catequizando, LocalDate dataAula, boolean presente) {
		this.catequizando = catequizando;
		this.dataAula = dataAula;
		this.presente = presente;
	}

	public Long getId() {
		return id;
	}

	public Catequizando getCatequizando() {
		return catequizando;
	}

	public void setCatequizando(Catequizando catequizando) {
		this.catequizando = catequizando;
	}

	public LocalDate getDataAula() {
		return dataAula;
	}

	public void setDataAula(LocalDate dataAula) {
		this.dataAula = dataAula;
	}

	public boolean isPresente() {
		return presente;
	}

	public void setPresente(boolean presente) {
		this.presente = presente;
	}

}