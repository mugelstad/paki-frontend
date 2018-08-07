import {createSwitchNavigator, createStackNavigator} from 'react-navigation';
import LoginScreen from './src/LoginScreen'
import HouseScreen from './src/HouseScreen'
import RegisterScreen from './src/RegisterScreen'
import UploadScreen from './src/UploadScreen'
import WorkScreen from './src/WorkScreen'
import BrowseScreen from './src/BrowseScreen'

const AppStack = createStackNavigator({ Upload: UploadScreen, Browse: BrowseScreen, Work: WorkScreen,  House: HouseScreen })
const AuthStack = createStackNavigator({ Login: LoginScreen, Register: RegisterScreen });

export default createSwitchNavigator({
  App: AppStack,
  Auth: AuthStack
},
{
  initialRouteName: 'App'
})
