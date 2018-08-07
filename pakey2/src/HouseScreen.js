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

class HouseScreen extends React.Component {
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
   title: 'House'
 };

 currentLocation(){
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

 getHouseLatLong(){
   var address = this.state.address;
   address.split(' ').join('+')
   console.log('ADDRESS', address)
   fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_MAPS_API_KEY}`, {
     method: 'GET',
   })
   .then(response => response.json())
   .then(responseJson => {
     if(responseJson) {
       console.log(responseJson)
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


 setHouseLocation() {
   fetch('https://ee4f8815.ngrok.io/myHouse', {
     method: 'POST',
     headers: {
       "Content-Type": "application/json"
     },
     credentials: 'include',
     body: JSON.stringify({
       latitude: this.state.latitude,
       longitude: this.state.longitude,
       monthlyRent: this.state.monthlyRent,
       sqft: this.state.sqft,

     })
   })
   .then(response => response.json())
   .then(responseJson => {
     if(responseJson.success) {
       this.props.navigation.navigate('Work');
       console.log(responseJson);

     } else {
       console.log('unsuccessful response')
     }
   })
   .catch((err) => {
     console.log('error fetching', err)
   });
 }

 componentDidMount(){
   AsyncStorage.getItem('latitude')
   .then((result) => {
     if (result !== 'null'){
       this.setState({latitude: JSON.parse(result)})
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
         <View>
           <FormInput
             placeholder="Enter your home address"
             onChangeText={(text) => this.setState({address: text})}
             value={this.state.address}
           />
           <FormValidationMessage>
             {this.state.address ? null: 'this field is required'}
           </FormValidationMessage>
         </View>
         <View>
           <FormInput
             placeholder="Enter your home's square footage"
             onChangeText={(text) => this.setState({sqft: text})}
             value={this.state.sqft}
           />
           <FormValidationMessage>
             {this.state.sqft ? null: 'this field is required'}
           </FormValidationMessage>
         </View>
         <View>
           <FormInput
             placeholder="Enter your home's monthly rent"
             onChangeText={(text) => this.setState({monthlyRent: text})}
             value={this.state.monthlyRent}
           />
           <FormValidationMessage>
             {this.state.sqft ? null: 'this field is required'}
           </FormValidationMessage>
         </View>
         <Button onPress={() => this.getHouseLatLong()} title='save' />
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
   </View>
   )
 }
}


export default HouseScreen
