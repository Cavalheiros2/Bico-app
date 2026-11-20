import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CadastroParteUm } from './CadastroParteUm';
import { CadastroParteDois } from './CadastroParteDois';
import { CadastroParteTres } from './CadastroParteTres';
import { colors } from '../../styles/colors';

const Stack = createNativeStackNavigator();

export type CadastroStackParamList = {
  CadastroParteUm: undefined;
  CadastroParteDois: undefined;
  CadastroParteTres: undefined;
}

export function Cadastro() {
  return (
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.corSolicitante}, headerTitle:'' }}>
        <Stack.Screen name="CadastroParteUm" component={CadastroParteUm} />
        <Stack.Screen name="CadastroParteDois" component={CadastroParteDois} />
        <Stack.Screen name="CadastroParteTres" component={CadastroParteTres} />
      </Stack.Navigator>
  );
}
