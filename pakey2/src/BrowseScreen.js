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
  Image
} from 'react-native';

import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button
} from 'react-native-elements'

import styles from '../StyleSheet'

export default class BrowseScreen extends React.Component {
 constructor(){
   super();
   this.state = {
     latitude: 0,
     longitude: 0,
   }
 }

 static navigationOptions = {
   title: 'Browse'
 };

 componentDidMount(){
   //Get location from storage
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
   AsyncStorage.getItem('longitude')
   .then((result) => {
     if (result !== 'null'){
       this.setState({longitude: JSON.parse(result)})
     }
   })
 }

 getPhotos(){
   fetch('https://ee4f8815.ngrok.io/photos', {
     method: 'GET'
   })
   .then(response => response.json())
   .then(responseJson => {
     if(responseJson.success) {
       console.log(responseJson);
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
     <View style={{flex: 1}}>
      <View>
       <TouchableOpacity onPress={() => this.getPhotos()} value={'get photos'}>
         <Text>Get Photos</Text>
       </TouchableOpacity>
      </View>
     <MapView
       style={{flex: 1}}
       region={{
         latitude: this.state.latitude,
         longitude: this.state.longitude,
         latitudeDelta: .5,
         longitudeDelta: .25}}
       onRegionChangeComplete={() => {
         AsyncStorage.setItem('latitude', JSON.stringify(this.state.latitude))
         AsyncStorage.setItem('longitude', JSON.stringify(this.state.longitude))
       }}
     />
     <ScrollView
       style={{flex: 1, height: 150}}
       showsHorizontalScrollIndicator={true}
       horizontal={true}
       bounces={true}
       >
         <Image source={{uri:'https://facebook.github.io/react-native/img/favicon.png', width: 120, height: 120}} borderColor={"white"} borderWidth={10}/>
         <Image source={{uri:'https://facebook.github.io/react-native/img/favicon.png', width: 64, height: 64}}/>
         <Image source={{uri:'https://facebook.github.io/react-native/img/favicon.png', width: 64, height: 64}}/>
         <Image source={{uri:'https://facebook.github.io/react-native/img/favicon.png', width: 64, height: 64}}/>
         <Image source={{uri:'https://facebook.github.io/react-native/img/favicon.png', width: 64, height: 64}}/>
         <Image source={{uri:'https://facebook.github.io/react-native/img/favicon.png', width: 64, height: 64}}/>
         <Image source={{uri:'https://facebook.github.io/react-native/img/favicon.png', width: 64, height: 64}}/>
         <Image source={{uri:'https://facebook.github.io/react-native/img/favicon.png', width: 64, height: 64}}/>
         <Image source={{uri:'https://facebook.github.io/react-native/img/favicon.png', width: 64, height: 64}}/>
         <Image source={{uri:'https://facebook.github.io/react-native/img/favicon.png', width: 64, height: 64}}/>
         <Image source={{uri:'https://facebook.github.io/react-native/img/favicon.png', width: 64, height: 64}}/>
         <Image source={{uri:'https://facebook.github.io/react-native/img/favicon.png', width: 64, height: 64}}/>
         <Image source={{uri:'https://facebook.github.io/react-native/img/favicon.png', width: 64, height: 64}}/>
         <Image source={{uri:'https://facebook.github.io/react-native/img/favicon.png', width: 64, height: 64}}/>


     </ScrollView>
   </View>
   )
 }
}
