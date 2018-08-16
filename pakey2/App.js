import {createBottomTabNavigator, createSwitchNavigator, createStackNavigator} from 'react-navigation';
import { Icon } from 'expo';
import  React from 'react';
import LoginScreen from './src/LoginScreen'
import HouseScreen from './src/HouseScreen'
import RegisterScreen from './src/RegisterScreen'
import UploadScreen from './src/UploadScreen'
import WorkScreen from './src/WorkScreen'
import BrowseScreen from './src/BrowseScreen'
import MenuNavigator from './src/Navigate'
import SwitchScreen from './src/SwitchScreen'
import SavedScreen from './src/SavedScreen'
import OfferScreen from './src/OfferScreen'
import ChatScreen from './src/ChatScreen'

const AppStack = createStackNavigator({
  Browse: BrowseScreen,
  Switch: SwitchScreen
})

AppStack.navigationOptions = {
  tabBarLabel: 'Explore',
  tabBarIcon: ({focused}) => (
    <Icon.Ionicons
        name={'ios-search-outline'}
        size={26}
      />
  )
}
const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen
});

const SettingsStack = createStackNavigator({
  Upload: UploadScreen,
  House: HouseScreen,
  Work: WorkScreen
})
SettingsStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({focused}) => (
    <Icon.EvilIcons
      name='user'
      size={26}
    />
  )
}
const SavedStack = createStackNavigator({
  Saved: SavedScreen,
})

SavedStack.navigationOptions = {
  tabBarLabel: 'Saved',
  tabBarIcon: () => (
    <Icon.EvilIcons
      name='heart'
      size={26}
    />)
}

const OfferStack = createStackNavigator({
  Offer: OfferScreen, Chat: ChatScreen
})

OfferStack.navigationOptions = {
  tabBarLabel: 'Offers',
  tabBarIcon: () => (
    <Icon.Ionicons
      name='ios-chatboxes-outline'
      size={26}
    />)
}
const tabs = createBottomTabNavigator({
  Browse: AppStack, Saved: SavedStack, Offers: OfferStack, Settings: SettingsStack
})


// HomeStack.navigationOptions = {
//   tabBarLabel: 'Read',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={
//         Platform.OS === 'ios'
//           ? `ios-glasses${focused ? '' : '-outline'}`
//           : 'md-glasses'
//       }
//     />
//   ),
// };
export default createSwitchNavigator({
  Main: tabs,
  Auth: AuthStack
},
{
  initialRouteName: 'Auth'
})

// export default MenuNavigator;
