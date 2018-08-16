import { MapView } from 'expo';
import GOOGLE_MAPS_API_KEY from '../secrets'
import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TextInput
} from 'react-native';

import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button
} from 'react-native-elements'

import styles from '../StyleSheet'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default class WorkScreen extends React.Component {
 constructor(){
   super();
   this.state = {
     latitude: 0,
     longitude: 0,
     address: '',
     sqft: '',
     monthlyRent: '',
   }
 }

 static navigationOptions = {
   title: 'Work',
   tabBarLabel: 'Work',
 }

 getWorkLatLong(){
   var address = this.state.address;
   address.split(' ').join('+')
   fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_MAPS_API_KEY}`, {
     method: 'GET',
   })
   .then(response => response.json())
   .then(responseJson => {
     if(responseJson) {
       console.log('@@getWorkLatLong', this.state.address)
       console.log('@@getWorkLatLong responseJson', responseJson)
       this.setState({
         latitude: Number(responseJson.results[0].geometry.location.lat),
         longitude: Number(responseJson.results[0].geometry.location.lng)
       })
     } else {
       console.log('unsuccessful response')
     }
   })
   .catch((err) => {
     console.log('error fetching', err)
   });
 }


 async setWorkLocation() {
   await this.getWorkLatLong()
   fetch('http://b82a27f2.ngrok.io/myWork', {
     method: 'POST',
     headers: {
       "Content-Type": "application/json"
     },
     credentials: 'include',
     body: JSON.stringify({
       address: this.state.address,
       latitude: this.state.latitude,
       longitude: this.state.longitude,
     })
   })
   .then(response => response.json())
   .then(responseJson => {
     if(responseJson.success) {
       console.log('@@setWorkLocation', responseJson)
       this.props.navigation.navigate('Browse');
     } else {
       console.log('unsuccessful response')
     }
   })
   .catch((err) => {
     console.log('error fetching', err)
   });
 }

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

 render() {
   return (
     <View style={{flex: 1}}>
       <View>
         <FormInput
           placeholder="Enter your work address"
           onChangeText={(text) => this.setState({address: text})}
           value={this.state.address}
         />
         <FormValidationMessage>
           {this.state.address ? null: 'this field is required'}
         </FormValidationMessage>
       </View>
       <Button onPress={() => this.setWorkLocation()} title='save'
         backgroundColor={'#66cdff'}
         style={{padding: 10}}/>
     <MapView
       style={{flex: 1}}
       region={{
         latitude: parseFloat(this.state.latitude),
         longitude: parseFloat(this.state.longitude),
         latitudeDelta: .5,
         longitudeDelta: .25}}
       onRegionChangeComplete={() => {
         AsyncStorage.setItem('latitude', JSON.stringify(this.state.latitude))
         AsyncStorage.setItem('longitude', JSON.stringify(this.state.longitude))
       }}
     />
   </View>
   )
 }
}
