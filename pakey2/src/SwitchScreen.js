import { MapView } from 'expo';
import GOOGLE_MAPS_API_KEY from '../secrets'
import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TextInput,
  ScrollView,
  Image,
  TouchableHighlight
} from 'react-native';

const { Marker } = MapView;

import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button
} from 'react-native-elements'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import styles from '../StyleSheet'

export default class SwitchScreen extends React.Component {
 constructor(){
   super();
   this.state = {
     latitude: 0,
     longitude: 0,
     images: [],
     monthlyRent:0,
     pins: [{
       id: '123',
       coordinate: {
         longitude: -122.414053,
         latitude: 37.789875
       }
     }]
   }
 }

 static navigationOptions = {
   title: 'Switch',
   tabBarLabel: 'Switch',
   drawerIcon: ({tintColor}) => {
     return (
       <MaterialIcons
         name="near-me"
         size={24}
         style={{color: tintColor}}
         >
         </MaterialIcons>
     )
   }
 }

 componentDidMount(){
   this.getPhotosByHouseId()
   // Get location from storage
   AsyncStorage.getItem('latitude')
   .then((result) => {
     if (result !== 'null'){
       this.setState({latitude: JSON.parse(result)})
     } else {
       //Get User's current location on first load
       navigator.geolocation.getCurrentPosition(
         (success) => {
           this.setState({
             latitude: success.coords.latitude,
             longitude: success.coords.longitude
           })
         }, (error) => {
           console.log('error', error)
         }
       )
     }
   })

   // Get location from storage
   AsyncStorage.getItem('longitude')
   .then((result) => {
     if (result !== 'null'){
       this.setState({longitude: JSON.parse(result)})
     }
   })
 }

 getPhotosByHouseId(){
   fetch(`http://4cb55702.ngrok.io/switchInfo?houseId=${this.props.navigation.getParam('houseId')}`, {
     method: 'GET'
   })
   .then(response => response.json())
   .then(responseJson => {
     if (responseJson.success){
      console.log(responseJson.house)
      this.setState({
        latitude: responseJson.house.latitude,
        longitude: responseJson.house.longitude,
        monthlyRent: responseJson.house.monthlyRent,
        sqft: responseJson.house.sqft,
        images: responseJson.pictures
       })
    } else {
      console.log('unsuccessful response')
    }
  })
  .catch((err) => {
    console.log('error fetching', err)
  });
 }

 render() {
   return (
     <View style={{flex: 1, height: 150}}>
       <ScrollView>
       <View style={{padding: 20}}>
         <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
           <MaterialIcons name="menu" size={24} style={{color: 'black'}}>
           </MaterialIcons>
         </TouchableOpacity>
       </View>
       <ScrollView
         style={{flex: 1}}
         showsHorizontalScrollIndicator={true}
         horizontal={true}
         bounces={true}
         >
           {this.state.images.map(picture => (
             <TouchableOpacity>
               <Image source={{uri: `data:image/png;base64,${picture}`}} style={{height: 300, width: 300}}/>
             </TouchableOpacity>
           ))}
       </ScrollView>
       <View style={{padding:30}}>
        <MapView
         style={{flex: 1, height: 300}}
         region={{
           latitude: this.state.latitude,
           longitude: this.state.longitude,
           latitudeDelta: .25,
           longitudeDelta: .0125}}
         onRegionChangeComplete={() => {
           AsyncStorage.setItem('latitude', JSON.stringify(this.state.latitude))
           AsyncStorage.setItem('longitude', JSON.stringify(this.state.longitude))
         }}>
         <Marker
           coordinate={{
             latitude: Number(this.state.latitude),
             longitude: Number(this.state.longitude),
           }}>
         </Marker>
       </MapView>
      </View>
      <View style={{padding: 20}}>
        <Text>monthly rent: </Text>
        <Text>address: </Text>
        <Text>area: </Text>
      </View>
     </ScrollView>
   </View>
   )
 }
}
