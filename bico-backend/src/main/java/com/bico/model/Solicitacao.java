package com.bico.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "solicitacoes")
public class Solicitacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitacao")
    private Long id;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "data_solicitacao", length = 20)
    private String dataSolicitacao;

    @Column(name = "hora_solicitacao", length = 20)
    private String horaSolicitacao;

    @Column(name = "local_solicitacao", length = 150)
    private String localSolicitacao;

    @Column(name = "proposta_valor", precision = 10, scale = 2)
    private BigDecimal propostaValor;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;

    public Solicitacao() {
    }

    public Solicitacao(Long id, String descricao, String dataSolicitacao, String horaSolicitacao,
            String localSolicitacao, BigDecimal propostaValor, Usuario usuario, Categoria categoria) {
        this.id = id;
        this.descricao = descricao;
        this.dataSolicitacao = dataSolicitacao;
        this.horaSolicitacao = horaSolicitacao;
        this.localSolicitacao = localSolicitacao;
        this.propostaValor = propostaValor;
        this.usuario = usuario;
        this.categoria = categoria;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getDataSolicitacao() {
        return dataSolicitacao;
    }

    public void setDataSolicitacao(String dataSolicitacao) {
        this.dataSolicitacao = dataSolicitacao;
    }

    public String getHoraSolicitacao() {
        return horaSolicitacao;
    }

    public void setHoraSolicitacao(String horaSolicitacao) {
        this.horaSolicitacao = horaSolicitacao;
    }

    public String getLocalSolicitacao() {
        return localSolicitacao;
    }

    public void setLocalSolicitacao(String localSolicitacao) {
        this.localSolicitacao = localSolicitacao;
    }

    public BigDecimal getPropostaValor() {
        return propostaValor;
    }

    public void setPropostaValor(BigDecimal propostaValor) {
        this.propostaValor = propostaValor;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
}
