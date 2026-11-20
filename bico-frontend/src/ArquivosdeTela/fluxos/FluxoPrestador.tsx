import { colors } from '../../styles/colors';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuPrestador } from '../telasPrestador/MenuPrestador';


const Stack = createNativeStackNavigator();

export type PrestadorStackParamList = {
  MenuPrestador: undefined;
  //adicionar todas as telas que colocar nesse fluxo aqui 
  // e exportar essa lista para dentro do menu indicado
}

export function FluxoPrestador() {
  return (
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.corPrestador}, headerTitle:'' }}>
        <Stack.Screen name=" MenuPrestador" component={MenuPrestador} />
        
      </Stack.Navigator>
  );
}