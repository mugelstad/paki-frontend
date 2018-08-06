import {createSwitchNavigator, createStackNavigator} from 'react-navigation';
import LoginScreen from './src/LoginScreen'
import HouseScreen from './src/HouseScreen'

const AppStack = createStackNavigator({ House: HouseScreen })
const AuthStack = createStackNavigator({ Login: LoginScreen });

export default createSwitchNavigator({
  App: AppStack,
  Auth: AuthStack
},
{
  initialRouteName: 'Auth'
})
