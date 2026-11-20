import { FluxoPrestador } from './src/ArquivosdeTela/fluxos/FluxoPrestador';
import { FluxoSolicitante } from './src/ArquivosdeTela/fluxos/FluxoSolicitante';
import { FluxoAmbos } from './src/ArquivosdeTela/fluxos/FluxoAmbos';
import { Login } from './src/ArquivosdeTela/login/Login';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Cadastro } from './src/ArquivosdeTela/telasCadastro/Cadastro';
import { AuthProvider } from './src/contexts/AuthContext';

const Stack = createNativeStackNavigator();

export type RootStack = {
  Login: undefined;
  FluxoSolicitante: undefined;
  FluxoPrestador: undefined;
  FluxoAmbos: undefined;
  Cadastro: undefined;
}
declare global {
  namespace ReactNavigation{
    interface RootParamList extends RootStack{}
  }
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="FluxoPrestador" component={FluxoPrestador} />
          <Stack.Screen name="FluxoSolicitante" component={FluxoSolicitante} />
          <Stack.Screen name="FluxoAmbos" component={FluxoAmbos} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
