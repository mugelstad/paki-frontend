import React from 'react';
import {Button, Text, Platform, ScrollView, StyleSheet} from 'react-native';
import {DrawerNavigator} from 'react-navigation';

import BrowseScreen from './BrowseScreen'
import HouseScreen from './HouseScreen'
import UploadScreen from './UploadScreen'
import WorkScreen from './WorkScreen'

const MenuNavigator = DrawerNavigator({
    First: {
      screen: BrowseScreen,
    },
    Second: {
      screen: HouseScreen
    },
    Third: {
      screen: UploadScreen
    },
    Fourth: {
      screen: WorkScreen
    }
}, {
  initialRouoteName: 'First',
  drawerPosition: 'left',
  drawerWidth: 200,
  contentOptions: {
    activeTintColor: '#66c2ff'
  }
}
);

export default MenuNavigator;
