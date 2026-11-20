import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { colors } from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';

export function CadastroParteTres() {

  const navigation = useNavigation();

  const listaCategorias =[
    {label: 'Encanador', value: 'encanador'},
    {label: 'Eletricista', value: 'eletricista'},
    { label: 'Pintor', value: 'pintor' },
    { label: 'Limpeza', value: 'limpeza' },   
  ];

  return (
    <KeyboardAvoidingView style={styles.container}>

            <View style={styles.bloco3}>
              <Text style={styles.texto}>Localização</Text>
            </View>

            <View style={styles.bloco}>
              <Text style={styles.texto}>Selecione</Text>
            </View>

            <TouchableHighlight
                style={styles.botao}
                underlayColor="#ddd"
                onPress={() => {navigation.reset({
                  index: 0,
                  routes: [{ name: 'FluxoSolicitante' }],
                  });
                }}>  
                <Text style={styles.texto}>Seguinte</Text>
            </TouchableHighlight>
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