package com.catequiza.aluno.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Catequizando (aluno) matriculado em uma turma.
 * Mapeamento espelhado de forma identica nos dois back-ends
 * (app-catequista/backend-admin e app-catequizando/backend-aluno).
 */
@Entity
@Table(name = "catequizando")
public class Catequizando {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 150)
	private String nome;

	@Column(nullable = false, unique = true, length = 20)
	private String matricula;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "turma_id")
	private Turma turma;

	protected Catequizando() {
		// exigido pelo JPA
	}

	public Catequizando(String nome, String matricula, Turma turma) {
		this.nome = nome;
		this.matricula = matricula;
		this.turma = turma;
	}

	public Long getId() {
		return id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getMatricula() {
		return matricula;
	}

	public void setMatricula(String matricula) {
		this.matricula = matricula;
	}

	public Turma getTurma() {
		return turma;
	}

	public void setTurma(Turma turma) {
		this.turma = turma;
	}

}