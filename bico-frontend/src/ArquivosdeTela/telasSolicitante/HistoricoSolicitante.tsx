import React, { useState, useCallback } from 'react';
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
  ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../styles/colors';

interface Categoria {
  id: number;
  nome: string;
}

interface Solicitacao {
  id: number;
  descricao: string;
  dataSolicitacao: string;
  horaSolicitacao: string;
  localSolicitacao: string;
  propostaValor: number;
  categoria?: Categoria;
}

export function HistoricoSolicitante() {
  const { usuario } = useAuth();
  const navigation = useNavigation<any>();

  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [selecionada, setSelecionada] = useState<Solicitacao | null>(null);

  // Estados do Modal de Edição
  const [modalVisivel, setModalVisivel] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [dataSolicitacao, setDataSolicitacao] = useState('');
  const [horaSolicitacao, setHoraSolicitacao] = useState('');
  const [localSolicitacao, setLocalSolicitacao] = useState('');
  const [propostaValor, setPropostaValor] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [salvando, setSalvando] = useState(false);

  // [GET] /solicitacoes/usuario/{idUsuario} e [GET] /categorias
  const carregarDados = useCallback(async () => {
    if (!usuario?.id) {
      setCarregando(false);
      setAtualizando(false);
      return;
    }

    try {
      setErro(null);
      const [respSolicitacoes, respCategorias] = await Promise.all([
        fetch(`${API_URL}/solicitacoes/usuario/${usuario.id}`),
        fetch(`${API_URL}/categorias`),
      ]);

      if (!respSolicitacoes.ok) {
        throw new Error('Falha ao buscar suas solicitações.');
      }

      const dadosSolicitacoes: Solicitacao[] = await respSolicitacoes.json();
      setSolicitacoes(dadosSolicitacoes);

      if (respCategorias.ok) {
        const dadosCategorias: Categoria[] = await respCategorias.json();
        setCategorias(dadosCategorias);
      }
    } catch (err) {
      setErro('Não foi possível carregar seu histórico do servidor.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, [usuario?.id]);

  // Recarrega automaticamente sempre que o usuário voltar para esta aba
  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  const aoAtualizar = () => {
    setAtualizando(true);
    carregarDados();
  };

  // Filtra por descrição, local ou nome da categoria
  const solicitacoesFiltradas = solicitacoes.filter((item) => {
    const termo = busca.toLowerCase();
    const desc = (item.descricao || '').toLowerCase();
    const local = (item.localSolicitacao || '').toLowerCase();
    const cat = (item.categoria?.nome || '').toLowerCase();

    return desc.includes(termo) || local.includes(termo) || cat.includes(termo);
  });

  // Formatações automáticas de Data e Hora
  const formatarData = (texto: string) => {
    const numeros = texto.replace(/\D/g, '');
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
  };

  const formatarHora = (texto: string) => {
    const numeros = texto.replace(/\D/g, '');
    if (numeros.length <= 2) return numeros;
    return `${numeros.slice(0, 2)}:${numeros.slice(2, 4)}`;
  };

  // Leva diretamente para a aba de criação de solicitação
  const handleNovaSolicitacao = () => {
    navigation.navigate('Solicitar');
  };

  // Abre modal preenchido para editar o item selecionado
  const abrirModalEditar = () => {
    if (!selecionada) {
      Alert.alert('Atenção', 'Selecione uma solicitação na lista para editar.');
      return;
    }

    setDescricao(selecionada.descricao);
    setDataSolicitacao(selecionada.dataSolicitacao);
    setHoraSolicitacao(selecionada.horaSolicitacao);
    setLocalSolicitacao(selecionada.localSolicitacao);
    setPropostaValor(String(selecionada.propostaValor).replace('.', ','));
    setCategoriaId(selecionada.categoria?.id || null);
    setModalVisivel(true);
  };

  // [PUT] /solicitacoes/{id}
  const handleSalvarEdicao = async () => {
    if (!selecionada) return;

    if (!categoriaId) {
      Alert.alert('Atenção', 'Selecione uma categoria.');
      return;
    }

    if (
      descricao.trim() === '' ||
      dataSolicitacao.trim().length < 10 ||
      horaSolicitacao.trim().length < 5 ||
      localSolicitacao.trim() === '' ||
      propostaValor.trim() === ''
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos corretamente.');
      return;
    }

    const valorNumerico = parseFloat(propostaValor.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Informe um valor válido.');
      return;
    }

    setSalvando(true);

    try {
      const resposta = await fetch(`${API_URL}/solicitacoes/${selecionada.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descricao: descricao.trim(),
          dataSolicitacao: dataSolicitacao.trim(),
          horaSolicitacao: horaSolicitacao.trim(),
          localSolicitacao: localSolicitacao.trim(),
          propostaValor: valorNumerico,
          categoria: {
            id: categoriaId,
          },
        }),
      });

      if (resposta.ok) {
        setModalVisivel(false);
        setSelecionada(null);
        carregarDados();
        Alert.alert('Sucesso', 'Solicitação atualizada!');
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar a solicitação.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha de conexão com o servidor.');
    } finally {
      setSalvando(false);
    }
  };

  // [DELETE] /solicitacoes/{id}
  const handleExcluir = () => {
    if (!selecionada) {
      Alert.alert('Atenção', 'Selecione uma solicitação na lista para excluir.');
      return;
    }

    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir esta solicitação de serviço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const resposta = await fetch(
                `${API_URL}/solicitacoes/${selecionada.id}`,
                { method: 'DELETE' }
              );

              if (resposta.ok || resposta.status === 204) {
                setSolicitacoes((prev) =>
                  prev.filter((item) => item.id !== selecionada.id)
                );
                setSelecionada(null);
              } else {
                Alert.alert('Erro', 'Não foi possível excluir no servidor.');
              }
            } catch (error) {
              Alert.alert('Erro', 'Falha de conexão ao tentar excluir.');
            }
          },
        },
      ]
    );
  };
  const renderizarSolicitacao = ({ item }: { item: Solicitacao }) => {
    const estaSelecionada = selecionada?.id === item.id;
    const valorFormatado = Number(item.propostaValor || 0)
      .toFixed(2)
      .replace('.', ',');

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => setSelecionada(estaSelecionada ? null : item)}
        style={[
          styles.cardSolicitacao,
          estaSelecionada && styles.cardSelecionado,
        ]}
      >
        <View style={styles.topoCard}>
          <View style={styles.badgeCategoria}>
            <Text style={styles.textoCategoria}>
              {item.categoria?.nome || 'Serviço'}
            </Text>
          </View>
          <Text style={styles.valorTexto}>R$ {valorFormatado}</Text>
        </View>

        <Text style={styles.descricaoTexto} numberOfLines={2}>
          {item.descricao}
        </Text>

        <View style={styles.rodapeCard}>
          <Text style={styles.detalheTexto}>
            📅 {item.dataSolicitacao} às {item.horaSolicitacao}
          </Text>
          <Text style={styles.detalheTexto} numberOfLines={1}>
            📍 {item.localSolicitacao}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Minhas Solicitações</Text>
        <Text style={styles.subtitulo}>
          {carregando
            ? 'Buscando histórico...'
            : `${solicitacoesFiltradas.length} pedidos registrados`}
        </Text>

        <TextInput
          style={styles.inputBusca}
          placeholder="Filtrar por serviço, categoria ou local..."
          placeholderTextColor="#666"
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {/* Área Delimitada da Lista */}
      <View style={styles.areaLista}>
        {carregando ? (
          <View style={styles.centro}>
            <ActivityIndicator size="large" color={colors.corSolicitante} />
            <Text style={styles.textoAviso}>Carregando suas solicitações...</Text>
          </View>
        ) : erro ? (
          <View style={styles.centro}>
            <Text style={styles.textoErro}>{erro}</Text>
            <TouchableOpacity
              style={styles.botaoTentarNovamente}
              onPress={() => {
                setCarregando(true);
                carregarDados();
              }}
            >
              <Text style={styles.textoBotaoEscuro}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={solicitacoesFiltradas}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderizarSolicitacao}
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
                  ? 'Nenhuma solicitação encontrada para esse filtro.'
                  : 'Você ainda não criou nenhuma solicitação.'}
              </Text>
            }
          />
        )}
      </View>

      {/* Barra Inferior Fixa com os 3 Botões */}
      <View style={styles.barraInferior}>
        <TouchableOpacity
          style={[styles.botaoAcao, styles.botaoNovo]}
          onPress={handleNovaSolicitacao}
        >
          <Text style={styles.textoBotaoEscuro}>Nova Solicitação</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botaoAcao,
            styles.botaoEditar,
            !selecionada && styles.botaoDesabilitado,
          ]}
          onPress={abrirModalEditar}
        >
          <Text style={styles.textoBotaoClaro}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botaoAcao,
            styles.botaoExcluir,
            !selecionada && styles.botaoDesabilitado,
          ]}
          onPress={handleExcluir}
        >
          <Text style={styles.textoBotaoClaro}>Excluir</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Edição da Solicitação */}
      <Modal
        visible={modalVisivel}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitulo}>Editar Solicitação</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.labelModal}>Categoria</Text>
              <View style={styles.listaCategoriasModal}>
                {categorias.map((cat) => {
                  const ativa = categoriaId === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.chipCategoria,
                        ativa && styles.chipCategoriaAtiva,
                      ]}
                      onPress={() => setCategoriaId(cat.id)}
                    >
                      <Text
                        style={[
                          styles.textoChip,
                          ativa && styles.textoChipAtivo,
                        ]}
                      >
                        {cat.nome}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.labelModal}>Descrição do Serviço</Text>
              <TextInput
                style={[styles.inputModal, { height: 80 }]}
                multiline
                textAlignVertical="top"
                value={descricao}
                onChangeText={setDescricao}
              />

              <View style={styles.linhaDupla}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.labelModal}>Data</Text>
                  <TextInput
                    style={styles.inputModal}
                    keyboardType="numeric"
                    maxLength={10}
                    value={dataSolicitacao}
                    onChangeText={(t) => setDataSolicitacao(formatarData(t))}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.labelModal}>Horário</Text>
                  <TextInput
                    style={styles.inputModal}
                    keyboardType="numeric"
                    maxLength={5}
                    value={horaSolicitacao}
                    onChangeText={(t) => setHoraSolicitacao(formatarHora(t))}
                  />
                </View>
              </View>

              <Text style={styles.labelModal}>Local</Text>
              <TextInput
                style={styles.inputModal}
                value={localSolicitacao}
                onChangeText={setLocalSolicitacao}
              />

              <Text style={styles.labelModal}>Proposta de Valor (R$)</Text>
              <TextInput
                style={styles.inputModal}
                keyboardType="decimal-pad"
                value={propostaValor}
                onChangeText={setPropostaValor}
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
                  onPress={handleSalvarEdicao}
                  disabled={salvando}
                >
                  <Text style={styles.textoBotaoEscuro}>
                    {salvando ? 'Salvando...' : 'Salvar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
    fontSize: 25,
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
  cardSolicitacao: {
    backgroundColor: colors.corBloco2,
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  cardSelecionado: {
    borderColor: colors.corSolicitante,
    backgroundColor: '#fffdf0',
  },
  topoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeCategoria: {
    backgroundColor: colors.fundoSolicitante,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.corSolicitante,
  },
  textoCategoria: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.corTexto,
  },
  valorTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d8a22',
  },
  descricaoTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.corTexto,
    marginBottom: 10,
  },
  rodapeCard: {
    borderTopWidth: 1,
    borderTopColor: colors.corBloco,
    paddingTop: 8,
    gap: 4,
  },
  detalheTexto: {
    fontSize: 12,
    color: '#555555',
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
    gap: 8,
  },
  botaoAcao: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoNovo: {
    flex: 1.4,
    backgroundColor: colors.corSolicitante,
  },
  botaoEditar: {
    flex: 1,
    backgroundColor: '#2563eb',
  },
  botaoExcluir: {
    flex: 1,
    backgroundColor: '#dc2626',
  },
  botaoDesabilitado: {
    opacity: 0.45,
  },
  textoBotaoEscuro: {
    color: colors.corTexto,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  textoBotaoClaro: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    maxHeight: '85%',
    backgroundColor: colors.corBloco2,
    borderRadius: 22,
    padding: 20,
    borderBottomWidth: 5,
    borderColor: colors.corSolicitante,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.corTexto,
    marginBottom: 14,
    textAlign: 'center',
  },
  labelModal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.corTexto,
    marginBottom: 6,
  },
  listaCategoriasModal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  chipCategoria: {
    backgroundColor: colors.corBloco,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipCategoriaAtiva: {
    backgroundColor: colors.fundoSolicitante,
    borderColor: colors.corSolicitante,
  },
  textoChip: {
    fontSize: 12,
    color: '#444',
    fontWeight: '600',
  },
  textoChipAtivo: {
    color: colors.corTexto,
    fontWeight: 'bold',
  },
  inputModal: {
    backgroundColor: colors.corBloco,
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.corTexto,
    marginBottom: 12,
  },
  linhaDupla: {
    flexDirection: 'row',
    gap: 10,
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
    marginBottom: 6,
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