package com.bico.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.bico.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByEmailAndSenha(String email, String senha);
    
    Optional<Usuario> findByApelido(String apelido);

    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    boolean existsByApelido(String apelido);
}

