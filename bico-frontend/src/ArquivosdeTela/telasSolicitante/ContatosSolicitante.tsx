import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { API_URL } from '../../api/api';
import { useAuth, Usuario } from '../../contexts/AuthContext';
import { colors } from '../../styles/colors';

interface ContatoRegistro {
  id: number;
  apelidoContato?: string;
  usuarioContato: Usuario;
}

export function ContatosSolicitante() {
  const { usuario } = useAuth();

  const [contatos, setContatos] = useState<ContatoRegistro[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [contatoSelecionado, setContatoSelecionado] = useState<ContatoRegistro | null>(null);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [apelidoUsuarioBusca, setApelidoUsuarioBusca] = useState('');
  const [apelidoPersonalizado, setApelidoPersonalizado] = useState('');
  const [salvando, setSalvando] = useState(false);

  const carregarContatos = useCallback(async () => {
    if (!usuario?.id) {
      setCarregando(false);
      setAtualizando(false);
      return;
    }

    try {
      setErro(null);
      const resposta = await fetch(`${API_URL}/contatos/usuario/${usuario.id}`);

      if (!resposta.ok) {
        throw new Error('Falha ao buscar contatos do servidor.');
      }

      const dados: ContatoRegistro[] = await resposta.json();
      setContatos(dados);
    } catch (err) {
      setErro('Não foi possível carregar os contatos do servidor.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, [usuario?.id]);

  useEffect(() => {
    carregarContatos();
  }, [carregarContatos]);

  const aoAtualizar = () => {
    setAtualizando(true);
    carregarContatos();
  };

  const contatosFiltrados = contatos.filter((item) => {
    const termo = busca.toLowerCase();
    const nomeExibicao = (item.apelidoContato || item.usuarioContato?.nome || '').toLowerCase();
    const apelidoReal = (item.usuarioContato?.apelido || '').toLowerCase();
    const telefone = item.usuarioContato?.telefone || '';

    return (
      nomeExibicao.includes(termo) ||
      apelidoReal.includes(termo) ||
      telefone.includes(busca)
    );
  });

  const obterIniciais = (nome: string) => {
    const partes = nome.trim().split(' ');
    const primeira = partes?.[0]?.[0] || '';
    const segunda = partes?.[1]?.[0] || '';
    return (primeira + segunda).toUpperCase();
  };

  const abrirModalAdicionar = () => {
    setModoEdicao(false);
    setApelidoUsuarioBusca('');
    setApelidoPersonalizado('');
    setModalVisivel(true);
  };

  const abrirModalEditar = () => {
    if (!contatoSelecionado) {
      Alert.alert('Atenção', 'Selecione um contato na lista para editar.');
      return;
    }
    setModoEdicao(true);
    setApelidoUsuarioBusca(contatoSelecionado.usuarioContato.apelido);
    setApelidoPersonalizado(
      contatoSelecionado.apelidoContato || contatoSelecionado.usuarioContato.nome
    );
    setModalVisivel(true);
  };

  const handleSalvarContato = async () => {
    if (!usuario?.id) return;

    if (!modoEdicao && apelidoUsuarioBusca.trim() === '') {
      Alert.alert('Atenção', 'Informe o apelido do usuário que deseja adicionar.');
      return;
    }

    if (apelidoPersonalizado.trim() === '') {
      Alert.alert('Atenção', 'Informe um nome ou apelido para salvar o contato.');
      return;
    }

    setSalvando(true);

    try {
      if (modoEdicao && contatoSelecionado) {
        await fetch(`${API_URL}/contatos/${contatoSelecionado.id}`, {
          method: 'DELETE',
        });

        const respPost = await fetch(`${API_URL}/contatos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuarioPrincipal: { id: usuario.id },
            usuarioContato: { id: contatoSelecionado.usuarioContato.id },
            apelidoContato: apelidoPersonalizado.trim(),
          }),
        });

        if (!respPost.ok) {
          throw new Error('Erro ao atualizar contato.');
        }

        setContatoSelecionado(null);
        setModalVisivel(false);
        carregarContatos();
      } else {
        const respUsuario = await fetch(
          `${API_URL}/usuarios/apelido/${apelidoUsuarioBusca.trim()}`
        );

        if (!respUsuario.ok) {
          Alert.alert('Não encontrado', 'Nenhum usuário encontrado com esse apelido.');
          setSalvando(false);
          return;
        }

        const usuarioEncontrado: Usuario = await respUsuario.json();

        if (usuarioEncontrado.id === usuario.id) {
          Alert.alert('Atenção', 'Você não pode adicionar a si mesmo aos contatos.');
          setSalvando(false);
          return;
        }

        const respContato = await fetch(`${API_URL}/contatos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuarioPrincipal: { id: usuario.id },
            usuarioContato: { id: usuarioEncontrado.id },
            apelidoContato: apelidoPersonalizado.trim(),
          }),
        });

        if (respContato.ok) {
          setModalVisivel(false);
          carregarContatos();
        } else {
          Alert.alert('Atenção', 'Este usuário já está na sua lista de contatos.');
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível concluir a operação no servidor.');
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = () => {
    if (!contatoSelecionado) {
      Alert.alert('Atenção', 'Selecione um contato na lista para excluir.');
      return;
    }

    const nomeExibicao =
      contatoSelecionado.apelidoContato || contatoSelecionado.usuarioContato.nome;

    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente remover ${nomeExibicao} dos seus contatos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const resposta = await fetch(
                `${API_URL}/contatos/${contatoSelecionado.id}`,
                { method: 'DELETE' }
              );

              if (resposta.ok || resposta.status === 204) {
                setContatos((prev) =>
                  prev.filter((c) => c.id !== contatoSelecionado.id)
                );
                setContatoSelecionado(null);
              } else {
                Alert.alert('Erro', 'Não foi possível excluir o contato no servidor.');
              }
            } catch (error) {
              Alert.alert('Erro', 'Falha de conexão ao tentar excluir.');
            }
          },
        },
      ]
    );
  };
  const renderizarContato = ({ item }: { item: ContatoRegistro }) => {
    const estaSelecionado = contatoSelecionado?.id === item.id;
    const nomePrincipal = item.apelidoContato || item.usuarioContato?.nome || 'Sem nome';
    const telefoneContato = item.usuarioContato?.telefone || 'Sem telefone';

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setContatoSelecionado(estaSelecionado ? null : item)}
        style={[
          styles.cardContato,
          estaSelecionado && styles.cardContatoSelecionado,
        ]}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{obterIniciais(nomePrincipal)}</Text>
        </View>

        <View style={styles.infoContato}>
          <Text style={styles.nomeContato}>{nomePrincipal}</Text>
          <Text style={styles.apelidoUsuarioTexto}>
            @{item.usuarioContato?.apelido} • {telefoneContato}
          </Text>
        </View>

      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.titulo}>Contatos</Text>
        <Text style={styles.subtitulo}>
          {carregando
            ? 'Buscando contatos...'
            : `${contatosFiltrados.length} contatos salvos`}
        </Text>

        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar por nome, @apelido ou número..."
          placeholderTextColor="#666"
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <View style={styles.areaLista}>
        {carregando ? (
          <View style={styles.centro}>
            <ActivityIndicator size="large" color={colors.corSolicitante} />
            <Text style={styles.textoAviso}>Carregando contatos...</Text>
          </View>
        ) : erro ? (
          <View style={styles.centro}>
            <Text style={styles.textoErro}>{erro}</Text>
            <TouchableOpacity
              style={styles.botaoTentarNovamente}
              onPress={() => {
                setCarregando(true);
                carregarContatos();
              }}
            >
              <Text style={styles.textoBotaoEscuro}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={contatosFiltrados}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderizarContato}
            contentContainerStyle={styles.listaContainer}
            refreshControl={
              <RefreshControl
                refreshing={atualizando}
                onRefresh={aoAtualizar}
                colors={[colors.corSolicitante]}
              />
            }
            ListEmptyComponent={
              <Text style={styles.listaVazia}>
                {busca
                  ? 'Nenhum contato corresponde à sua busca.'
                  : 'Você ainda não possui contatos salvos.'}
              </Text>
            }
          />
        )}
      </View>

      <View style={styles.barraInferior}>
        <TouchableOpacity
          style={[styles.botaoAcao, styles.botaoAdicionar]}
          onPress={abrirModalAdicionar}
        >
          <Text style={styles.textoBotaoEscuro}>Adicionar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botaoAcao,
            styles.botaoEditar,
            !contatoSelecionado && styles.botaoDesabilitado,
          ]}
          onPress={abrirModalEditar}
        >
          <Text style={styles.textoBotaoClaro}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botaoAcao,
            styles.botaoExcluir,
            !contatoSelecionado && styles.botaoDesabilitado,
          ]}
          onPress={handleExcluir}
        >
          <Text style={styles.textoBotaoClaro}>Excluir</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitulo}>
              {modoEdicao ? 'Editar Contato' : 'Novo Contato'}
            </Text>

            {!modoEdicao && (
              <>
                <Text style={styles.labelModal}>Apelido (@) do usuário no app:</Text>
                <TextInput
                  style={styles.inputModal}
                  placeholder="Ex: joaosilva"
                  autoCapitalize="none"
                  value={apelidoUsuarioBusca}
                  onChangeText={setApelidoUsuarioBusca}
                />
              </>
            )}

            <Text style={styles.labelModal}>Nome / Apelido na sua agenda:</Text>
            <TextInput
              style={styles.inputModal}
              placeholder="Ex: João Eletricista"
              value={apelidoPersonalizado}
              onChangeText={setApelidoPersonalizado}
            />

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={[styles.botaoModal, styles.botaoCancelarModal]}
                onPress={() => setModalVisivel(false)}
                disabled={salvando}
              >
                <Text style={styles.textoBotaoEscuro}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botaoModal, styles.botaoSalvarModal]}
                onPress={handleSalvarContato}
                disabled={salvando}
              >
                <Text style={styles.textoBotaoEscuro}>
                  {salvando ? 'Salvando...' : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fundoSolicitante,
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },
  header: {
    backgroundColor: colors.corSolicitante,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.corTexto,
  },
  subtitulo: {
    fontSize: 13,
    color: '#4a4100',
    marginBottom: 12,
  },
  inputBusca: {
    backgroundColor: colors.corBloco2,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.corTexto,
  },
  areaLista: {
    flex: 1,
    marginHorizontal: 14,
    marginTop: 14,
    marginBottom: 10,
    backgroundColor: colors.corBloco,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e6deb0',
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textoAviso: {
    marginTop: 12,
    fontSize: 15,
    color: '#555',
  },
  textoErro: {
    fontSize: 15,
    color: '#c92a2a',
    textAlign: 'center',
    marginBottom: 16,
  },
  botaoTentarNovamente: {
    backgroundColor: colors.corSolicitante,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  listaContainer: {
    padding: 12,
    flexGrow: 1,
  },
  cardContato: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.corBloco2,
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  cardContatoSelecionado: {
    borderColor: colors.corSolicitante,
    backgroundColor: '#fffdf0',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.fundoSolicitante,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.corSolicitante,
  },
  avatarTexto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.corTexto,
  },
  infoContato: {
    flex: 1,
  },
  nomeContato: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.corTexto,
  },
  apelidoUsuarioTexto: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  botaoLigar: {
    backgroundColor: colors.corPrestador,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
  },
  textoBotaoLigar: {
    color: colors.corTexto,
    fontWeight: 'bold',
    fontSize: 13,
  },
  listaVazia: {
    textAlign: 'center',
    color: '#666',
    marginTop: 40,
    fontSize: 15,
  },
  barraInferior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 12 : 16,
    backgroundColor: colors.corBloco2,
    borderTopWidth: 1,
    borderTopColor: '#e6deb0',
    gap: 10,
  },
  botaoAcao: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoAdicionar: {
    backgroundColor: colors.corSolicitante,
  },
  botaoEditar: {
    backgroundColor: '#2563eb',
  },
  botaoExcluir: {
    backgroundColor: '#dc2626',
  },
  botaoDesabilitado: {
    opacity: 0.45,
  },
  textoBotaoEscuro: {
    color: colors.corTexto,
    fontWeight: 'bold',
    fontSize: 15,
  },
  textoBotaoClaro: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.corBloco2,
    borderRadius: 20,
    padding: 20,
    borderBottomWidth: 5,
    borderColor: colors.corSolicitante,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.corTexto,
    marginBottom: 16,
    textAlign: 'center',
  },
  labelModal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.corTexto,
    marginBottom: 6,
  },
  inputModal: {
    backgroundColor: colors.corBloco,
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.corTexto,
    marginBottom: 14,
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  botaoModal: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  botaoCancelarModal: {
    backgroundColor: colors.corBloco,
  },
  botaoSalvarModal: {
    backgroundColor: colors.corSolicitante,
  },
});