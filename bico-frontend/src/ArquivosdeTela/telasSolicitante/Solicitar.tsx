import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { API_URL } from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../styles/colors';

interface Categoria {
  id: number;
  nome: string;
}

export function Solicitar() {
  const { usuario } = useAuth();

  // Estados das Categorias do Banco
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);

  // Estados do Formulário de Solicitação
  const [descricao, setDescricao] = useState('');
  const [dataSolicitacao, setDataSolicitacao] = useState('');
  const [horaSolicitacao, setHoraSolicitacao] = useState('');
  const [localSolicitacao, setLocalSolicitacao] = useState('');
  const [propostaValor, setPropostaValor] = useState('');
  const [enviando, setEnviando] = useState(false);

  // [GET] /categorias
  const carregarCategorias = useCallback(async () => {
    try {
      const resposta = await fetch(`${API_URL}/categorias`);
      if (resposta.ok) {
        const dados: Categoria[] = await resposta.json();
        setCategorias(dados);
      } else {
        Alert.alert('Aviso', 'Não foi possível carregar as categorias.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha de conexão ao buscar categorias.');
    } finally {
      setCarregandoCategorias(false);
    }
  }, []);

  useEffect(() => {
    carregarCategorias();
  }, [carregarCategorias]);

  // Formata automaticamente a data enquanto digita (DD/MM/AAAA)
  const formatarData = (texto: string) => {
    const numeros = texto.replace(/\D/g, '');
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
  };

  // Formata automaticamente a hora enquanto digita (HH:MM)
  const formatarHora = (texto: string) => {
    const numeros = texto.replace(/\D/g, '');
    if (numeros.length <= 2) return numeros;
    return `${numeros.slice(0, 2)}:${numeros.slice(2, 4)}`;
  };

  // [POST] /solicitacoes
  const handleCriarSolicitacao = async () => {
    if (!usuario?.id) {
      Alert.alert('Erro', 'Usuário não identificado na sessão.');
      return;
    }

    if (!categoriaSelecionada) {
      Alert.alert('Atenção', 'Selecione uma categoria de serviço.');
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
      Alert.alert('Atenção', 'Informe um valor de proposta válido.');
      return;
    }

    setEnviando(true);

    try {
      const payload = {
        descricao: descricao.trim(),
        dataSolicitacao: dataSolicitacao.trim(),
        horaSolicitacao: horaSolicitacao.trim(),
        localSolicitacao: localSolicitacao.trim(),
        propostaValor: valorNumerico,
        usuario: {
          id: usuario.id,
        },
        categoria: {
          id: categoriaSelecionada,
        },
      };

      const resposta = await fetch(`${API_URL}/solicitacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (resposta.ok || resposta.status === 201) {
        Alert.alert('Sucesso!', 'Sua solicitação de serviço foi publicada.');
        // Limpa o formulário após publicar
        setDescricao('');
        setDataSolicitacao('');
        setHoraSolicitacao('');
        setLocalSolicitacao('');
        setPropostaValor('');
        setCategoriaSelecionada(null);
      } else {
        Alert.alert('Erro', 'Não foi possível registrar a solicitação no servidor.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha de conexão com o servidor.');
    } finally {
      setEnviando(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.titulo}>Nova Solicitação</Text>
        <Text style={styles.subtitulo}>
          Descreva o serviço que você precisa
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollConteudo}
          showsVerticalScrollIndicator={false}
        >
          {/* Seção de Seleção de Categoria */}
          <View style={styles.card}>
            <Text style={styles.label}>1. Escolha a Categoria</Text>

            {carregandoCategorias ? (
              <ActivityIndicator
                size="small"
                color={colors.corSolicitante}
                style={{ marginVertical: 12 }}
              />
            ) : categorias.length === 0 ? (
              <Text style={styles.avisoVazio}>
                Nenhuma categoria cadastrada no banco.
              </Text>
            ) : (
              <View style={styles.listaCategorias}>
                {categorias.map((cat) => {
                  const selecionada = categoriaSelecionada === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.chipCategoria,
                        selecionada && styles.chipCategoriaSelecionada,
                      ]}
                      onPress={() => setCategoriaSelecionada(cat.id)}
                    >
                      <Text
                        style={[
                          styles.textoChip,
                          selecionada && styles.textoChipSelecionado,
                        ]}
                      >
                        {cat.nome}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Seção de Detalhes do Serviço */}
          <View style={styles.card}>
            <Text style={styles.label}>2. O que precisa ser feito?</Text>
            <TextInput
              style={[styles.input, styles.inputMultilinha]}
              placeholder="Descreva os detalhes do serviço..."
              placeholderTextColor="#777"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={descricao}
              onChangeText={setDescricao}
            />

            <View style={styles.linhaDupla}>
              <View style={styles.colunaMetade}>
                <Text style={styles.label}>3. Data</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#777"
                  keyboardType="numeric"
                  maxLength={10}
                  value={dataSolicitacao}
                  onChangeText={(texto) => setDataSolicitacao(formatarData(texto))}
                />
              </View>

              <View style={styles.colunaMetade}>
                <Text style={styles.label}>4. Horário</Text>
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM"
                  placeholderTextColor="#777"
                  keyboardType="numeric"
                  maxLength={5}
                  value={horaSolicitacao}
                  onChangeText={(texto) => setHoraSolicitacao(formatarHora(texto))}
                />
              </View>
            </View>

            <Text style={styles.label}>5. Local do Serviço</Text>
            <TextInput
              style={styles.input}
              placeholder="Bairro, Rua ou Cidade..."
              placeholderTextColor="#777"
              value={localSolicitacao}
              onChangeText={setLocalSolicitacao}
            />

            <Text style={styles.label}>6. Proposta de Valor (R$)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 120,50"
              placeholderTextColor="#777"
              keyboardType="decimal-pad"
              value={propostaValor}
              onChangeText={setPropostaValor}
            />
          </View>

          <TouchableOpacity
            style={[styles.botaoPublicar, enviando && styles.botaoDesabilitado]}
            onPress={handleCriarSolicitacao}
            disabled={enviando}
          >
            <Text style={styles.textoBotaoPublicar}>
              {enviando ? 'Publicando...' : 'Publicar Solicitação'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingTop: 16,
    paddingBottom: 22,
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
    marginTop: 2,
  },
  scrollConteudo: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.corBloco2,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderBottomWidth: 4,
    borderColor: colors.corSolicitante,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.corTexto,
    marginBottom: 8,
  },
  avisoVazio: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  listaCategorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipCategoria: {
    backgroundColor: colors.corBloco,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipCategoriaSelecionada: {
    backgroundColor: colors.fundoSolicitante,
    borderColor: colors.corSolicitante,
  },
  textoChip: {
    fontSize: 13,
    color: '#444',
    fontWeight: '600',
  },
  textoChipSelecionado: {
    color: colors.corTexto,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: colors.corBloco,
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.corTexto,
    marginBottom: 14,
  },
  inputMultilinha: {
    height: 95,
    paddingTop: 12,
  },
  linhaDupla: {
    flexDirection: 'row',
    gap: 12,
  },
  colunaMetade: {
    flex: 1,
  },
  botaoPublicar: {
    backgroundColor: colors.corSolicitante,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotaoPublicar: {
    color: colors.corTexto,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
