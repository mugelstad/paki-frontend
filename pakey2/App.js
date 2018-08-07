import {createSwitchNavigator, createStackNavigator} from 'react-navigation';
import LoginScreen from './src/LoginScreen'
import HouseScreen from './src/HouseScreen'
import RegisterScreen from './src/RegisterScreen'

import UploadScreen from './src/UploadScreen'
import WorkScreen from './src/WorkScreen'
import BrowseScreen from './src/BrowseScreen'

<<<<<<< HEAD
const AppStack = createStackNavigator({ Upload: UploadScreen, Browse: BrowseScreen, Work: WorkScreen,  House: HouseScreen })
=======

const AppStack = createStackNavigator({ Upload: UploadScreen, House: HouseScreen })
>>>>>>> f22fd0022d66b595f008a89bbd0181e9268b4d6d
const AuthStack = createStackNavigator({ Login: LoginScreen, Register: RegisterScreen });

export default createSwitchNavigator({
  App: AppStack,
  Auth: AuthStack
},
{
  initialRouteName: 'App'
})
