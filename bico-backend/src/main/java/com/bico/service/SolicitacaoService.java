package com.bico.service;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.bico.model.Categoria;
import com.bico.model.Solicitacao;
import com.bico.model.Usuario;
import com.bico.repository.SolicitacaoRepository;

@Service
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final UsuarioService usuarioService;
    private final CategoriaService categoriaService;

    public SolicitacaoService(SolicitacaoRepository solicitacaoRepository, UsuarioService usuarioService,
            CategoriaService categoriaService) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.usuarioService = usuarioService;
        this.categoriaService = categoriaService;
    }

    public List<Solicitacao> listarTodas() {
        return solicitacaoRepository.findAll();
    }

    public Solicitacao buscar(Long id) {
        return solicitacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada"));
    }

    public List<Solicitacao> listarPorUsuario(Long idUsuario) {
        return solicitacaoRepository.findByUsuarioId(idUsuario);
    }

    public List<Solicitacao> listarPorCategoria(Long idCategoria) {
        return solicitacaoRepository.findByCategoriaId(idCategoria);
    }

    public Solicitacao salvar(Solicitacao solicitacao) {
        
        if (solicitacao.getUsuario() != null && solicitacao.getUsuario().getId() != null) {
            Usuario u = usuarioService.buscar(solicitacao.getUsuario().getId());
            solicitacao.setUsuario(u);
        }
        if (solicitacao.getCategoria() != null && solicitacao.getCategoria().getId() != null) {
            Categoria c = categoriaService.buscar(solicitacao.getCategoria().getId());
            solicitacao.setCategoria(c);
        }
        return solicitacaoRepository.save(solicitacao);
    }

    public Solicitacao atualizar(Long id, Solicitacao dadosAtualizados) {
        Solicitacao existente = buscar(id);

        existente.setDescricao(dadosAtualizados.getDescricao());
        existente.setDataSolicitacao(dadosAtualizados.getDataSolicitacao());
        existente.setHoraSolicitacao(dadosAtualizados.getHoraSolicitacao());
        existente.setLocalSolicitacao(dadosAtualizados.getLocalSolicitacao());
        existente.setPropostaValor(dadosAtualizados.getPropostaValor());

        if (dadosAtualizados.getCategoria() != null && dadosAtualizados.getCategoria().getId() != null) {
            Categoria c = categoriaService.buscar(dadosAtualizados.getCategoria().getId());
            existente.setCategoria(c);
        }

        return solicitacaoRepository.save(existente);
    }

    public void excluir(Long id) {
        solicitacaoRepository.deleteById(id);
    }
}
