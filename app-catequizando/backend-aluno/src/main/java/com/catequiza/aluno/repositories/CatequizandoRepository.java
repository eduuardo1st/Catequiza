package com.catequiza.aluno.repositories;

import com.catequiza.aluno.domain.Catequizando;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatequizandoRepository extends JpaRepository<Catequizando, Long> {
}
