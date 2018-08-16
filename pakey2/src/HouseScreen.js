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

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import styles from '../StyleSheet'

export default class HouseScreen extends React.Component {
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
   title: 'House',
   tabBarLabel: 'House',
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
       console.log('@@ HouseScreen getHouseLatLong',responseJson)
       this.setState({
         latitude: Number(responseJson.results[0].geometry.location.lat),
         longitude: Number(responseJson.results[0].geometry.location.lng)
       })
       fetch('http://b82a27f2.ngrok.io/myHouse', {
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
           address: this.state.address
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
     } else {
       console.log('unsuccessful response')
     }
   })
   .catch((err) => {
     console.log('error fetching', err)
   });
 }


 async setHouseLocation() {
   await this.getHouseLatLong();
   console.log('@@setHouseLocation', this.state)
   // fetch('http://b82a27f2.ngrok.io/myHouse', {
   //   method: 'POST',
   //   headers: {
   //     "Content-Type": "application/json"
   //   },
   //   credentials: 'include',
   //   body: JSON.stringify({
   //     latitude: this.state.latitude,
   //     longitude: this.state.longitude,
   //     monthlyRent: this.state.monthlyRent,
   //     sqft: this.state.sqft,
   //     address: this.state.address
   //   })
   // })
   // .then(response => response.json())
   // .then(responseJson => {
   //   if(responseJson.success) {
   //     this.props.navigation.navigate('Work');
   //     console.log(responseJson);
   //   } else {
   //     console.log('unsuccessful response')
   //   }
   // })
   // .catch((err) => {
   //   console.log('error fetching', err)
   // });
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
         <View>
           <FormInput
             style={styles.formInput}
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
         <Button backgroundColor={'#66cdff'}
           style={{padding: 10}}
           onPress={() => this.setHouseLocation()} title='save' />
     </View>
     <MapView
       style={{flex: 1}}
       region={{
         latitude: parseFloat(this.state.latitude),
         longitude: parseFloat(this.state.longitude),
         latitudeDelta: .0625,
         longitudeDelta: .03125}}
       onRegionChangeComplete={() => {
         AsyncStorage.setItem('latitude', JSON.stringify(this.state.latitude))
         AsyncStorage.setItem('longitude', JSON.stringify(this.state.longitude))
       }}
     />
   </View>
   )
 }
}
