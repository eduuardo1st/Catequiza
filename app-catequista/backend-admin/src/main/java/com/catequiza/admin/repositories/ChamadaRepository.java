package com.catequiza.admin.repositories;

import com.catequiza.admin.domain.Chamada;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChamadaRepository extends JpaRepository<Chamada, Long> {
    List<Chamada> findByAulaId(Long aulaId);
    List<Chamada> findByAulaTurmaId(Long turmaId);
    List<Chamada> findByCatequizandoMatricula(Long matricula);
    Optional<Chamada> findByAulaIdAndCatequizandoMatricula(Long aulaId, Long matricula);
}
