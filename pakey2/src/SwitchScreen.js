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
  TouchableHighlight,
} from 'react-native';

const { Marker } = MapView;

import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button
} from 'react-native-elements';

import DialogInput from 'react-native-dialog-input';

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
     userhouseRent: 0,
     sqft: 0,
     isDialogVisible: false,
     saved: false,
     offered: false
   };
 }

 static navigationOptions = {
   title: 'Switch',
   tabBarLabel: 'Switch'
 }

 componentDidMount(){
   this.getPhotosByHouseId();
   console.log('@@ userhouseRent', this.state.userhouseRent);
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
  // Get saved state from AsyncStorage
  AsyncStorage.getItem('saved')
  .then((result) => {
    if (result !== 'null'){
      this.setState({saved: JSON.parse(result)})
    }
  })
 }

 getPhotosByHouseId(){
   console.log('@@switchScreen this.props.navigation.getParam', this.props.navigation.getParam('houseId'))
   fetch(`http://eecea53d.ngrok.io/switchInfo?houseId=${this.props.navigation.getParam('houseId')}`, {
     method: 'GET'
   })
   .then(response => response.json())
   .then(responseJson => {
     console.log('@@switchScreen getPhotosByHouseId', responseJson)
     if (responseJson.success) {
      console.log('@@SwitchScreen getPhotosByHouseId2', responseJson.userhouse.monthlyRent)
      this.setState({
        latitude: responseJson.otherhouse.latitude,
        longitude: responseJson.otherhouse.longitude,
        monthlyRent: responseJson.otherhouse.monthlyRent,
        address: responseJson.otherhouse.address,
        sqft: responseJson.otherhouse.sqft,
        images: responseJson.pictures,
        userhouseRent: responseJson.userhouse.monthlyRent
       })
       console.log('@@this.state',this.state)
    } else {
      console.log('unsuccessful response')
    }
  })
  .catch((err) => {
    console.log('error fetching', err)
  });
 }

 showDialog(bool){
   this.setState({
     isDialogVisible: bool
   })
 }

 sendOffer(inputText){
   fetch('http://eecea53d.ngrok.io/sendOffer', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     credentials: 'include',
     body: JSON.stringify({
       otherhouseId: this.props.navigation.getParam('houseId'),
       amount: `${this.state.monthlyRent > this.state.userhouseRent ? '' : '-'}${inputText}`
     })
   })
   .then(resp => resp.json())
   .then(responseJson => {
     if (responseJson.success) {
       this.showDialog(false)
     }
   })
 }

 saveHouse(){
   fetch('http://eecea53d.ngrok.io/saveInterested', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     credentials: 'include',
     body: JSON.stringify({
       otherhouseId: this.props.navigation.getParam('houseId')
     })
   })
   .then(resp => resp.json())
   .then(responseJson => {
     if (responseJson.success) {
       this.setState({
         saved: true
       })
       AsyncStorage.setItem('saved', JSON.stringify(this.state.saved));
     }
   })
 }

 removeHouse(){
   fetch('http://eecea53d.ngrok.io/removeInterested', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     credentials: 'include',
     body: JSON.stringify({
       otherhouseId: this.props.navigation.getParam('houseId')
     })
   })
   .then(resp => resp.json())
   .then(responseJson => {
     if (responseJson.success) {
       this.setState({
         saved: false
       })
       AsyncStorage.setItem('saved', JSON.stringify(this.state.saved));
     }
   })
 }

 render() {
   return (
     <View style={{flex: 1, height: 150}}>
       <ScrollView>
       <ScrollView
         style={{flex: 1}}
         showsHorizontalScrollIndicator={true}
         horizontal={true}
         bounces={true}
         >
           {this.state.images.map(picture => (
             <TouchableOpacity key={this.state.images.indexOf(picture)}>
               <Image source={{uri: `data:image/png;base64,${picture}`}} style={{height: 300, width: 300}}/>
             </TouchableOpacity>
           ))}
       </ScrollView>
       <View style={{padding:30}}>
        <MapView
         style={{flex: 1, height: 300}}
         region={{
           latitude: parseFloat(this.state.latitude),
           longitude: parseFloat(this.state.longitude),
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
        <Text>monthly rent: ${this.state.monthlyRent} </Text>
        <Text>my rent: ${this.state.userhouseRent}</Text>
        <Text>address: {this.state.address} </Text>
        <Text>area: {this.state.sqft} sqft</Text>
      </View>
      <View style={{paddingBottom: 0, paddingLeft: 20, paddingRight: 20, paddingTop: 20}}>
        <Button raised title={this.state.monthlyRent > this.state.userhouseRent ? 'Offer' : 'Request'}
          backgroundColor={'blue'}
          style={{padding: 10}}
          onPress={() => {this.showDialog(true)}}/>
      </View>
      <DialogInput isDialogVisible={this.state.isDialogVisible}
        title={this.state.monthlyRent > this.state.userhouseRent ? "Offer for Switch" : 'Request for Switch'}
        dialogStyle={{backgroundColor: 'white'}}
        message={"enter amount to switch"}
        hintInput ={"$0-300"}
        submitInput={ (inputText) => {this.sendOffer(inputText)} }
        closeDialog={ () => {this.showDialog(false)}}>
      </DialogInput>
      {this.state.saved ?
        <View style={{paddingBottom: 20, paddingLeft: 20, paddingRight: 20, paddingTop: 0}}>
          <Button raised title='Remove'
            backgroundColor={'#66c2ff'}
            style={{padding: 10}}
            onPress={() => {this.removeHouse()}}/>
        </View>
        :
        <View style={{paddingBottom: 20, paddingLeft: 20, paddingRight: 20, paddingTop: 0}}>
          <Button raised title='Save'
            backgroundColor={'#66c2ff'}
            style={{padding: 10}}
            onPress={() => {this.saveHouse()}}/>
        </View>}
     </ScrollView>
   </View>
   )
 }
}
