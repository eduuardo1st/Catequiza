package com.catequiza.admin.repositories;

import com.catequiza.admin.domain.Catequista;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatequistaRepository extends JpaRepository<Catequista, Long> {

    Optional<Catequista> findByEmail(String email);
}
