package com.catequiza.admin.repositories;

import com.catequiza.admin.domain.Catequizando;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatequizandoRepository extends JpaRepository<Catequizando, Long> {
}
