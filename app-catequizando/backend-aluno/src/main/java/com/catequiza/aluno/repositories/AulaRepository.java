package com.catequiza.aluno.repositories;

import com.catequiza.aluno.domain.Aula;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AulaRepository extends JpaRepository<Aula, Long> {

    Optional<Aula> findByPin(String pin);
}
