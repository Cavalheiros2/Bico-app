package com.bico.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.bico.model.Contato;
import com.bico.service.ContatoService;

@RestController
@RequestMapping("/contatos")
public class ContatoController {

    private final ContatoService service;

    public ContatoController(ContatoService service) {
        this.service = service;
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<Contato> listarPorUsuario(@PathVariable Long idUsuario) {
        return service.listarPorUsuario(idUsuario);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Contato adicionar(@RequestBody Contato contato) {
        return service.salvar(contato);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
