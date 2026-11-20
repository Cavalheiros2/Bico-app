package com.bico.service;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.bico.model.Contato;
import com.bico.model.Usuario;
import com.bico.repository.ContatoRepository;

@Service
public class ContatoService {

    private final ContatoRepository contatoRepository;
    private final UsuarioService usuarioService;

    public ContatoService(ContatoRepository contatoRepository, UsuarioService usuarioService) {
        this.contatoRepository = contatoRepository;
        this.usuarioService = usuarioService;
    }

    public List<Contato> listarPorUsuario(Long idUsuarioPrincipal) {
        return contatoRepository.findByUsuarioPrincipalId(idUsuarioPrincipal);
    }

    public Contato salvar(Contato contato) {
        Long idPrincipal = contato.getUsuarioPrincipal().getId();
        Long idAlvo = contato.getUsuarioContato().getId();

        if (idPrincipal.equals(idAlvo)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Você não pode adicionar a si mesmo como contato.");
        }

        if (contatoRepository.existsByUsuarioPrincipalIdAndUsuarioContatoId(idPrincipal, idAlvo)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Este usuário já está na sua lista de contatos.");
        }

        Usuario principal = usuarioService.buscar(idPrincipal);
        Usuario alvo = usuarioService.buscar(idAlvo);

        contato.setUsuarioPrincipal(principal);
        contato.setUsuarioContato(alvo);

        return contatoRepository.save(contato);
    }

    public void excluir(Long id) {
        contatoRepository.deleteById(id);
    }
}
