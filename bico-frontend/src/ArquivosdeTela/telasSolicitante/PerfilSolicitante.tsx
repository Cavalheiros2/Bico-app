import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../api/api';
import { useAuth, Usuario } from '../../contexts/AuthContext';
import { colors } from '../../styles/colors';

export function PerfilSolicitante() {
  const { usuario, setUsuario } = useAuth();
  const navigation = useNavigation();

  // Estados do Modal de Edição
  const [modalVisivel, setModalVisivel] = useState(false);
  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [salvando, setSalvando] = useState(false);

  const obterIniciais = (nomeCompleto?: string) => {
    if (!nomeCompleto) return 'US';
    const partes = nomeCompleto.trim().split(' ');
    const primeira = partes[0]?.[0] || '';
    const segunda = partes[1]?.[0] || '';
    return (primeira + segunda).toUpperCase();
  };

  // Preenche o modal com os dados atuais do contexto
  const abrirModalEdicao = () => {
    if (!usuario) return;
    setNome(usuario.nome);
    setApelido(usuario.apelido);
    setCpf(usuario.cpf);
    setEmail(usuario.email);
    setTelefone(usuario.telefone);
    setNovaSenha('');
    setModalVisivel(true);
  };

  // [PUT] /usuarios/{id}
  const handleSalvarEdicao = async () => {
    if (!usuario?.id) return;

    if (
      nome.trim() === '' ||
      apelido.trim() === '' ||
      cpf.trim() === '' ||
      email.trim() === '' ||
      telefone.trim() === ''
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    setSalvando(true);

    try {
      const resposta = await fetch(`${API_URL}/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome.trim(),
          apelido: apelido.trim(),
          cpf: cpf.trim(),
          email: email.trim(),
          telefone: telefone.trim(),
          senha: novaSenha.trim(), // Se vazio, a API mantém a senha atual
        }),
      });

      if (resposta.ok) {
        const usuarioAtualizado: Usuario = await resposta.json();
        setUsuario(usuarioAtualizado);
        setModalVisivel(false);
        Alert.alert('Sucesso', 'Seus dados foram atualizados!');
      } else {
        Alert.alert(
          'Atenção',
          'Não foi possível atualizar. Verifique se e-mail, CPF ou apelido já estão em uso.'
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha de conexão com o servidor.');
    } finally {
      setSalvando(false);
    }
  };

  // Sair da conta e voltar para Login
  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Deseja encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        onPress: () => {
          setUsuario(null);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  // [DELETE] /usuarios/{id}
  const handleExcluirConta = () => {
    if (!usuario?.id) return;

    Alert.alert(
      'Excluir Conta',
      'Tem certeza? Esta ação apagará permanentemente seu cadastro e não poderá ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir Conta',
          style: 'destructive',
          onPress: async () => {
            try {
              const resposta = await fetch(`${API_URL}/usuarios/${usuario.id}`, {
                method: 'DELETE',
              });

              if (resposta.ok || resposta.status === 204) {
                setUsuario(null);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              } else {
                Alert.alert('Erro', 'Não foi possível excluir a conta no servidor.');
              }
            } catch (error) {
              Alert.alert('Erro', 'Falha de conexão ao tentar excluir a conta.');
            }
          },
        },
      ]
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Cabeçalho com Avatar e Identificação */}
      <View style={styles.header}>
        <View style={styles.avatarGrande}>
          <Text style={styles.avatarTexto}>{obterIniciais(usuario?.nome)}</Text>
        </View>
        <Text style={styles.nomePrincipal}>{usuario?.nome || 'Usuário'}</Text>
        <Text style={styles.apelidoTexto}>@{usuario?.apelido || 'apelido'}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollConteudo}
        showsVerticalScrollIndicator={false}
      >
        {/* Cartão de Informações Cadastrais */}
        <View style={styles.cardInfo}>
          <Text style={styles.secaoTitulo}>Dados Pessoais</Text>

          <View style={styles.linhaInfo}>
            <Text style={styles.labelInfo}>E-mail</Text>
            <Text style={styles.valorInfo}>{usuario?.email || '-'}</Text>
          </View>

          <View style={styles.divisor} />

          <View style={styles.linhaInfo}>
            <Text style={styles.labelInfo}>Telefone</Text>
            <Text style={styles.valorInfo}>{usuario?.telefone || '-'}</Text>
          </View>

          <View style={styles.divisor} />

          <View style={styles.linhaInfo}>
            <Text style={styles.labelInfo}>CPF</Text>
            <Text style={styles.valorInfo}>{usuario?.cpf || '-'}</Text>
          </View>
        </View>

        {/* Botões de Ação */}
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={abrirModalEdicao}
        >
          <Text style={styles.textoBotaoEscuro}>Editar Dados do Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoSair}
          onPress={handleLogout}
        >
          <Text style={styles.textoBotaoEscuro}>Sair da Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={handleExcluirConta}
        >
          <Text style={styles.textoBotaoExcluir}>Excluir Minha Conta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Edição de Perfil */}
      <Modal
        visible={modalVisivel}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitulo}>Editar Perfil</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.labelModal}>Nome Completo</Text>
              <TextInput
                style={styles.inputModal}
                value={nome}
                onChangeText={setNome}
              />

              <Text style={styles.labelModal}>Apelido (@)</Text>
              <TextInput
                style={styles.inputModal}
                autoCapitalize="none"
                value={apelido}
                onChangeText={setApelido}
              />

              <Text style={styles.labelModal}>E-mail</Text>
              <TextInput
                style={styles.inputModal}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.labelModal}>Telefone</Text>
              <TextInput
                style={styles.inputModal}
                keyboardType="phone-pad"
                value={telefone}
                onChangeText={setTelefone}
              />

              <Text style={styles.labelModal}>CPF</Text>
              <TextInput
                style={styles.inputModal}
                keyboardType="numeric"
                value={cpf}
                onChangeText={setCpf}
              />

              <Text style={styles.labelModal}>
                Nova Senha (deixe em branco para manter a atual)
              </Text>
              <TextInput
                style={styles.inputModal}
                placeholder="Digite apenas se quiser alterar"
                secureTextEntry
                value={novaSenha}
                onChangeText={setNovaSenha}
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
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatarGrande: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.corBloco2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  avatarTexto: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.corTexto,
  },
  nomePrincipal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.corTexto,
  },
  apelidoTexto: {
    fontSize: 14,
    color: '#4a4100',
    marginTop: 2,
  },
  scrollConteudo: {
    padding: 18,
    paddingBottom: 36,
  },
  cardInfo: {
    backgroundColor: colors.corBloco2,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderBottomWidth: 4,
    borderColor: colors.corSolicitante,
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.corTexto,
    marginBottom: 14,
  },
  linhaInfo: {
    paddingVertical: 6,
  },
  labelInfo: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  valorInfo: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.corTexto,
  },
  divisor: {
    height: 1,
    backgroundColor: colors.corBloco,
    marginVertical: 8,
  },
  botaoEditar: {
    backgroundColor: colors.corSolicitante,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  botaoSair: {
    backgroundColor: colors.corBloco,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    marginBottom: 20,
  },
  textoBotaoEscuro: {
    color: colors.corTexto,
    fontWeight: 'bold',
    fontSize: 15,
  },
  botaoExcluir: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  textoBotaoExcluir: {
    color: '#dc2626',
    fontWeight: '600',
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
    marginBottom: 16,
    textAlign: 'center',
  },
  labelModal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.corTexto,
    marginBottom: 4,
  },
  inputModal: {
    backgroundColor: colors.corBloco,
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.corTexto,
    marginBottom: 12,
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
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
