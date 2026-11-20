import { API_URL } from '../../api/api';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, TextInput, TouchableHighlight } from 'react-native';
import { useState } from 'react';
import { colors } from '../../styles/colors';
import { useAuth } from '../../contexts/AuthContext';

export function Login() {

  const {setUsuario}= useAuth();
  const navigation = useNavigation();
  const [senha,setSenha]=useState('');
  const [email,setEmail]=useState('');
  
  const handleLogin = async () => {
    
    if (email.trim()==='' || senha.trim()==='') {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

      if(response.ok){
        const usuario = await response.json();
        setUsuario(usuario);
        navigation.reset({
          index: 0,
          routes: [{ name: 'FluxoSolicitante' }],
        });
      }else{
        Alert.alert('Atenção', 'E-mail ou senha inválidos.')
      }

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  };

  return (
    <LinearGradient
    colors={colors.degrade} 
    locations={[0.6, 1]}
    style={styles.container} >

        <TextInput placeholder='Email' 
          style={styles.bloco2}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"/>

      <TextInput placeholder='Insira uma senha'
        style={styles.bloco2}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}/>

        <TouchableHighlight
        style={styles.botao}
        underlayColor="#ddd"
        onPress={handleLogin}>
            <Text style={styles.texto}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight
        style={styles.botao}
        underlayColor="#ddd"
        onPress={() => {navigation.navigate('Cadastro')}}>
            <Text style={styles.texto}>CADASTRE-SE</Text>
        </TouchableHighlight>
        
        <StatusBar style="auto" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    color: colors.corTexto,
    fontWeight: '600',
  },
  botao: {
    backgroundColor: colors.corBloco,
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
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
});