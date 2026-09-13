package com.catequiza.aluno.repositories;

import com.catequiza.aluno.domain.Aula;
import com.catequiza.aluno.domain.Catequizando;
import com.catequiza.aluno.domain.Chamada;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChamadaRepository extends JpaRepository<Chamada, Long> {

    boolean existsByAulaAndCatequizando(Aula aula, Catequizando catequizando);
}
