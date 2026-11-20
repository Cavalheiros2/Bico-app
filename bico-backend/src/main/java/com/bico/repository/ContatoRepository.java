package com.bico.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bico.model.Contato;

public interface ContatoRepository extends JpaRepository<Contato, Long> {
    
    List<Contato> findByUsuarioPrincipalId(Long idUsuarioPrincipal);

    boolean existsByUsuarioPrincipalIdAndUsuarioContatoId(Long idPrincipal, Long idContato);
}