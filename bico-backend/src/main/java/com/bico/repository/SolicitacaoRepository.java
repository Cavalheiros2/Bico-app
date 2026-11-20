package com.bico.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bico.model.Solicitacao;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    
    List<Solicitacao> findByUsuarioId(Long idUsuario);

    List<Solicitacao> findByCategoriaId(Long idCategoria);
}
