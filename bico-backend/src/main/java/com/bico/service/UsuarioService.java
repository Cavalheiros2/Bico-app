package com.bico.service;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.bico.model.Usuario;
import com.bico.repository.UsuarioRepository;

@Service 
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario buscar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    public Usuario buscarPorApelido(String apelido) {
        return usuarioRepository.findByApelido(apelido)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Apelido não encontrado"));
    }

    public Usuario salvarUsuario(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Este e-mail já está cadastrado.");
        }
        if (usuarioRepository.existsByCpf(usuario.getCpf())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Este CPF já está cadastrado.");
        }
        if (usuarioRepository.existsByApelido(usuario.getApelido())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Este apelido já está em uso.");
        }
        return usuarioRepository.save(usuario);
    } 

    public void excluirUsuario(Long id) {
        usuarioRepository.deleteById(id);
    } 

    public Usuario fazerLogin(String email, String senha) {
        return usuarioRepository.findByEmailAndSenha(email, senha)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos"));
    }

    public Usuario atualizarUsuario(Long id, Usuario dadosAtualizados) {
        Usuario usuarioExistente = buscar(id);

        usuarioExistente.setNome(dadosAtualizados.getNome());
        usuarioExistente.setApelido(dadosAtualizados.getApelido());
        usuarioExistente.setCpf(dadosAtualizados.getCpf());
        usuarioExistente.setEmail(dadosAtualizados.getEmail());
        usuarioExistente.setTelefone(dadosAtualizados.getTelefone());
        
        if (dadosAtualizados.getSenha() != null && !dadosAtualizados.getSenha().isEmpty()) {
            usuarioExistente.setSenha(dadosAtualizados.getSenha());
        }

        return usuarioRepository.save(usuarioExistente);
    }
}