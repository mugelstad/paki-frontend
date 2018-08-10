import {createSwitchNavigator, createStackNavigator} from 'react-navigation';
import LoginScreen from './src/LoginScreen'
import HouseScreen from './src/HouseScreen'
import RegisterScreen from './src/RegisterScreen'
import UploadScreen from './src/UploadScreen'
import WorkScreen from './src/WorkScreen'
import BrowseScreen from './src/BrowseScreen'
import MenuNavigator from './src/Navigate'
import SwitchScreen from './src/SwitchScreen'

const AppStack = createStackNavigator({ Upload: UploadScreen, Switch: SwitchScreen, Browse: BrowseScreen, Work: WorkScreen, House: HouseScreen})
const AuthStack = createStackNavigator({ Login: LoginScreen, Register: RegisterScreen });


export default createSwitchNavigator({
  App: AppStack,
  Auth: AuthStack,
  Menu: MenuNavigator
},
{
  initialRouteName: 'Auth'
})

// export default MenuNavigator;
