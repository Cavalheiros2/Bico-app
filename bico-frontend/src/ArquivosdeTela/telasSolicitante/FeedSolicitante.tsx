import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../styles/colors';

export function FeedSolicitante() {
  return (
    <View style={styles.container}>
        <Text style={styles.texto}>Feed do Solicitante</Text>
        <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fundoSolicitante,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    color: colors.corTexto,
    fontWeight: '600',
  },
});