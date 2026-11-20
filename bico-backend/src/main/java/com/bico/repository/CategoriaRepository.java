package com.bico.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bico.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    boolean existsByNome(String nome);
}