import { MapView } from 'expo';
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
} from 'react-native-elements';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../StyleSheet';

export default class BrowseScreen extends React.Component {
 constructor(){
   super();
   this.state = {
     latitude: 0,
     longitude: 0,
     images: [],
     houses: []
   }
 }

 static navigationOptions = {
   title: 'Browse',
   tabBarLabel: 'Browse'
 }

componentDidMount(){
  this.getPhotos()
  this.getHouses()
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
             latitude: parseFloat(success.coords.latitude),
             longitude: parseFloat(success.coords.longitude)
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

 displayHouse(_id) {
   this.props.navigation.navigate('HouseInfo', { _id })
 }

 getHouses() {
   fetch('http://eecea53d.ngrok.io/houses', {
     method: 'GET'
   })
   .then(response => response.json())
   .then(responseJson => {
     if (responseJson.success){
       responseJson.houses.map(house => {
         this.setState({houses: this.state.houses.concat([house])})
       })
     } else {
       console.log('unsuccessful response in getHouses')
     }
   })
   .catch(err => {
     console.log('Error fetching houses', err)
   })
 }

 getPhotos(){
    fetch('http://eecea53d.ngrok.io/photos', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.success){
       responseJson.pictures.map(picture => {
         this.setState({images: this.state.images.concat([picture])})
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
   const renderPins = () => {
     if (this.state.houses[0]) {
       return this.state.houses.map(house => {
         return (<MapView.Marker
           key={house._id}
           coordinate={{
             latitude: parseFloat(house.latitude),
             longitude: parseFloat(house.longitude)
           }}
           title={house.monthlyRent + ''}
           onSelect={() => this.props.navigation.navigate('Switch', { houseId: house._id })}>
         </MapView.Marker>)
       })
     }
   }

   return (
     <View style={{flex: 1}}>
      <MapView
       style={{flex: 1}}
       region={{
         latitude: parseFloat(this.state.latitude),
         longitude: parseFloat(this.state.longitude),
         latitudeDelta: .25,
         longitudeDelta: .0125}}
       onRegionChangeComplete={() => {
         AsyncStorage.setItem('latitude', JSON.stringify(this.state.latitude))
         AsyncStorage.setItem('longitude', JSON.stringify(this.state.longitude))
       }}
       >
       {renderPins()}
     </MapView>
   </View>
   )
 }
}
