package com.bico.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.bico.model.Solicitacao;
import com.bico.service.SolicitacaoService;

@RestController
@RequestMapping("/solicitacoes")
public class SolicitacaoController {

    private final SolicitacaoService service;

    public SolicitacaoController(SolicitacaoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Solicitacao> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public Solicitacao buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<Solicitacao> listarPorUsuario(@PathVariable Long idUsuario) {
        return service.listarPorUsuario(idUsuario);
    }

    @GetMapping("/categoria/{idCategoria}")
    public List<Solicitacao> listarPorCategoria(@PathVariable Long idCategoria) {
        return service.listarPorCategoria(idCategoria);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Solicitacao criar(@RequestBody Solicitacao solicitacao) {
        return service.salvar(solicitacao);
    }

    @PutMapping("/{id}")
    public Solicitacao atualizar(@PathVariable Long id, @RequestBody Solicitacao solicitacao) {
        return service.atualizar(id, solicitacao);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
