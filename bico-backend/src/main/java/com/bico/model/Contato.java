package com.bico.model;

import jakarta.persistence.*;

@Entity
@Table(name = "contatos")
public class Contato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contato")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario_principal", nullable = false)
    private Usuario usuarioPrincipal;

    @ManyToOne
    @JoinColumn(name = "id_usuario_contato", nullable = false)
    private Usuario usuarioContato;

    @Column(name = "apelido_contato", length = 100)
    private String apelidoContato;

    public Contato() {
    }

    public Contato(Long id, Usuario usuarioPrincipal, Usuario usuarioContato, String apelidoContato) {
        this.id = id;
        this.usuarioPrincipal = usuarioPrincipal;
        this.usuarioContato = usuarioContato;
        this.apelidoContato = apelidoContato;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuarioPrincipal() { return usuarioPrincipal; }
    public void setUsuarioPrincipal(Usuario usuarioPrincipal) { this.usuarioPrincipal = usuarioPrincipal; }

    public Usuario getUsuarioContato() { return usuarioContato; }
    public void setUsuarioContato(Usuario usuarioContato) { this.usuarioContato = usuarioContato; }

    public String getApelidoContato() { return apelidoContato; }
    public void setApelidoContato(String apelidoContato) { this.apelidoContato = apelidoContato; }
}
