import { colors } from '../../styles/colors';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuSolicitante } from '../telasSolicitante/MenuSolicitante';


const Stack = createNativeStackNavigator();

export type SolicitanteStackParamList = {
  MenuSolicitante: undefined;
  //adicionar todas as telas que colocar nesse fluxo aqui 
  // e exportar essa lista para dentro do menu indicado
}

export function FluxoSolicitante() {
  return (
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.corSolicitante}, headerTitle:'' }}>
        <Stack.Screen name="MenuSolicitante" component={MenuSolicitante} />
        
      </Stack.Navigator>
  );
}