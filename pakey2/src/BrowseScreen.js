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
     images: []
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
     if (responseJson.success){
       console.log('successful response')
       // console.log('Rsponse json', JSON.parse(responseJson.picture)[0].img.data.data)
       img = JSON.parse(responseJson.picture)[0].img.data.data
       this.setState({images: this.state.images.push(img)});
       // console.log(this.state.images.length)
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
      <View>
       <TouchableOpacity onPress={() => this.getPhotos()}>
         <Text>Get Photos</Text>
       </TouchableOpacity>
      </View>
     <MapView
       style={{flex: 1}}
       region={{
         latitude: this.state.latitude,
         longitude: this.state.longitude,
         latitudeDelta: .25,
         longitudeDelta: .0125}}
       onRegionChangeComplete={() => {
         AsyncStorage.setItem('latitude', JSON.stringify(this.state.latitude))
         AsyncStorage.setItem('longitude', JSON.stringify(this.state.longitude))
       }}
     />
     <ScrollView
       style={{flex: 1}}
       showsHorizontalScrollIndicator={true}
       horizontal={true}
       bounces={true}
       >
         {this.state.images.map((base64ImageData) => {
           <Image source={{uri: base64ImageData}} style={{height: 150, width: 150, flex: 1}}/>
         })}
     </ScrollView>
   </View>
   )
 }
}
