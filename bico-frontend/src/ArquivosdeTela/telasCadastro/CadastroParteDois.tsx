import { Alert, KeyboardAvoidingView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { colors } from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CadastroStackParamList } from './Cadastro';
import { Checkbox } from 'expo-checkbox';
import { useState } from 'react';


export function CadastroParteDois() {

  const navigation = useNavigation<NativeStackNavigationProp<CadastroStackParamList>>();

  const [ prestar, setPrestar ] = useState(false);
  const [ solicitar, setSolicitar ] = useState(false);

  const handleSeguinte = () => {
    if(prestar || solicitar){
      navigation.navigate('CadastroParteTres');
    }else{
      Alert.alert('Atenção','Selecione pelo menos uma opção');
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container}>

            <View style={styles.bloco2}>
              <Text style={styles.texto}>Pretenção</Text>
            </View>

            <View style={styles.bloco}>
              <Text style={styles.texto}>Selecione</Text>

              <TouchableOpacity
                style={styles.botao2}
                onPress={() => setPrestar(!prestar)}>
                <Text style={styles.texto2}>Prestar Serviço</Text>
                <Checkbox
                  value={prestar}
                  onValueChange={setPrestar}
                  color={colors.corPrestador}
                />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botao2}
              onPress={() => setSolicitar(!solicitar)}>
                <Text style={styles.texto2}>Contratar Serviço</Text>
                <Checkbox
                  value={solicitar}
                  onValueChange={setSolicitar}
                  color={colors.corSolicitante}
                />
            </TouchableOpacity>

            </View>

            <TouchableHighlight
              style={styles.botao}
              underlayColor="#ddd"
              onPress={handleSeguinte}>
                <Text style={styles.texto}>Seguinte</Text>
            </TouchableHighlight>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
    backgroundColor: colors.fundoSolicitante,
    alignItems: 'center',
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
    backgroundColor: colors.corSolicitante,
    width: '57%',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: -25,
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
    botao2: {
    backgroundColor: colors.corBloco2,
    padding: 25,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
    width: '75%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  texto: {
    color: colors.corTexto,
    fontWeight: 600,
    fontSize: 24,
  },
    texto2: {
    color: colors.corTexto,
    fontWeight: 600,
    fontSize: 20,
  },
});