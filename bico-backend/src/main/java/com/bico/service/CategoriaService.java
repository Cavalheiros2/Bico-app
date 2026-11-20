package com.bico.service;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.bico.model.Categoria;
import com.bico.repository.CategoriaRepository;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    public Categoria buscar(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));
    }

    public Categoria salvar(Categoria categoria) {
        if (categoriaRepository.existsByNome(categoria.getNome())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Esta categoria já existe.");
        }
        return categoriaRepository.save(categoria);
    }

    public Categoria atualizar(Long id, Categoria dadosAtualizados) {
        Categoria existente = buscar(id);
        existente.setNome(dadosAtualizados.getNome());
        return categoriaRepository.save(existente);
    }

    public void excluir(Long id) {
        categoriaRepository.deleteById(id);
    }
}
