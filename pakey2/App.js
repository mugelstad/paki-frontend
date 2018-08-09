import {createSwitchNavigator, createStackNavigator} from 'react-navigation';
import LoginScreen from './src/LoginScreen'
import HouseScreen from './src/HouseScreen'
import RegisterScreen from './src/RegisterScreen'
import UploadScreen from './src/UploadScreen'
import WorkScreen from './src/WorkScreen'
import BrowseScreen from './src/BrowseScreen'

<<<<<<< HEAD
const AppStack = createStackNavigator({ Browse: BrowseScreen, Upload: UploadScreen, House: HouseScreen, Work: WorkScreen,  })
=======
const AppStack = createStackNavigator({ Upload: UploadScreen, Browse: BrowseScreen, House: HouseScreen, Work: WorkScreen   })
>>>>>>> master
const AuthStack = createStackNavigator({ Login: LoginScreen, Register: RegisterScreen });

export default createSwitchNavigator({
  App: AppStack,
  Auth: AuthStack
},
{
  initialRouteName: 'App'
})
