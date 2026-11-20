import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { FeedPrestador} from '../telasPrestador/FeedPrestador';

const Tab = createBottomTabNavigator();
export type BottomTabParamList = {

}

export function MenuPrestador() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="FeedPrestador" component={FeedPrestador} />
   
    </Tab.Navigator>  
  );
}
