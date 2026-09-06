package com.catequiza.admin.domain;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * Turma de catequese (ex.: "Crisma — Sab 16h").
 * Mapeamento espelhado de forma identica nos dois back-ends
 * (app-catequista/backend-admin e app-catequizando/backend-aluno).
 */
@Entity
@Table(name = "turma")
public class Turma {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 150)
	private String nome;

	@OneToMany(mappedBy = "turma")
	private List<Catequizando> catequizandos = new ArrayList<>();

	protected Turma() {
		// exigido pelo JPA
	}

	public Turma(String nome) {
		this.nome = nome;
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

	public List<Catequizando> getCatequizandos() {
		return catequizandos;
	}

	public void setCatequizandos(List<Catequizando> catequizandos) {
		this.catequizandos = catequizandos;
	}

}