import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { colors } from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../api/api';

export function CadastroParteUm() {

  const {setUsuario}= useAuth();
  const navigation = useNavigation();

  const [nome,setNome]=useState('');
  const [apelido,setApelido]=useState('');
  const [cpf,setCPF]=useState('');
  const [email,setEmail]=useState('');
  const [telefone,setTelefone]=useState('');
  const [senha,setSenha]=useState('');
  const [confSenha,setConfSenha]=useState('');

  const handleSeguinte = async () => {
    if(nome.trim()==='' ||
    apelido.trim()==='' ||
    cpf.trim()==='' ||
    email.trim()==='' ||
    telefone.trim()==='' ||
    senha.trim()==='' ||
    confSenha.trim()===''){
      Alert.alert('Atenção', 'Por favor, preencha todos os campos');
      return;
    }else if(senha !== confSenha){
      Alert.alert('Atenção', 'As senhas não coincidem');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, apelido, cpf,email, telefone, senha}),
    });
      if(response.ok){
        const usuario = await response.json();
        setUsuario(usuario);
        navigation.reset({
          index: 0,
          routes: [{ name: 'FluxoSolicitante' }],
        });
      }else{
        Alert.alert('Atenção','CPF, Email ou Apelido já cadastrado');
      }

    } catch (error) {
      Alert.alert('Erro no Servidor', 'Não foi possível realizar o Cadastro');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>

        <ScrollView 
          style={styles.scroll} 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>

            <View style={styles.bloco3}>
              <Text style={styles.texto}>Cadastro</Text>
            </View>

            <View style={styles.bloco}>
                <TextInput placeholder='Nome' 
                  style={styles.bloco2}
                  value={nome}
                  onChangeText={setNome}
                  />

                <TextInput placeholder='Apelido'
                  style={styles.bloco2}
                  value={apelido}
                  onChangeText={setApelido}/>

                <TextInput placeholder='CPF'
                  style={styles.bloco2}
                  keyboardType="numeric"
                  value={cpf} 
                  onChangeText={setCPF}/>

                <TextInput placeholder='E-mail'
                  style={styles.bloco2}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}/>

                <TextInput placeholder='Telefone'
                  style={styles.bloco2}
                  keyboardType="phone-pad"
                  value={telefone}
                  onChangeText={setTelefone}/>

                <Text>-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --</Text>

                <TextInput placeholder='Insira uma senha'
                style={styles.bloco2}
                secureTextEntry
                value={senha}
                onChangeText={setSenha}/>

                <TextInput placeholder='Confirme a senha'
                style={styles.bloco2}
                secureTextEntry
                value={confSenha}
                onChangeText={setConfSenha}/>
            </View>
            <TouchableHighlight
                style={styles.botao}
                underlayColor="#ddd"
                onPress={ handleSeguinte}>  
                <Text style={styles.texto}>Seguinte</Text>
            </TouchableHighlight>
        </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: colors.fundoSolicitante,
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 40, 
  },
  bloco: {
    backgroundColor: colors.corBloco,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 45,
    paddingBottom:5,
    borderRadius: 20,
    borderColor: colors.corSolicitante,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 5,
  },
  bloco2: {
    backgroundColor: colors.corBloco2,
    width: '70%',
    marginVertical: 10,
    color: colors.corTexto,
    fontWeight: 600,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10, 
  },
    bloco3: {
    backgroundColor: colors.corSolicitante,
    width: '57%',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: -30,
    zIndex: 1,
  },
  botao: {
    backgroundColor: colors.corSolicitante,
    padding: 10,
    borderRadius: 20,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  texto: {
    color: colors.corTexto,
    fontWeight: 600,
    fontSize: 24,
  },
});