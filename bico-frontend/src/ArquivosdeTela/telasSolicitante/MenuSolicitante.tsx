import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { PerfilSolicitante } from '../telasSolicitante/PerfilSolicitante';
import { FeedSolicitante } from '../telasSolicitante/FeedSolicitante';
import { HistoricoSolicitante } from '../telasSolicitante/HistoricoSolicitante';
import { Solicitar } from '../telasSolicitante/Solicitar';
import { ContatosSolicitante } from '../telasSolicitante/ContatosSolicitante';

const Tab = createBottomTabNavigator();
export type BottomTabParamList = {
  PerfilSolicitante: undefined;
  HistoricoSolicitante: undefined;
  Solicitar: undefined;
  ContatosSolicitante: undefined;
}
// CompositeNavigationProp serve para fundir a lista acima com a lista de Stack do fluxo 
// do solicitante fazer isso quando a tela precisar das 2 importações se não imporatar
//somente a que ele venha a usar ou a essa a cima ou a do fluxoSolicitante

export function MenuSolicitante() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} >
      <Tab.Screen name="Perfil" component={PerfilSolicitante} />
      <Tab.Screen name='Historico' component={HistoricoSolicitante}/>
      <Tab.Screen name='Solicitar' component={Solicitar}/>
      <Tab.Screen name='ContatosSolicitante' component={ContatosSolicitante}/>
    </Tab.Navigator>  
  );
}
