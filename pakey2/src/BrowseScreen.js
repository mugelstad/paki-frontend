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

const { Marker } = MapView;

import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button
} from 'react-native-elements'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import styles from '../StyleSheet'

export default class BrowseScreen extends React.Component {
 constructor(){
   super();
   this.state = {
     latitude: 0,
     longitude: 0,
     images: [],
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
   title: 'Browse',
   tabBarLabel: 'Browse',
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
   this.getPhotos()
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
       console.log(responseJson.pictures.length)

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

 markerRender(pinArray){
   return pinArray.map((pin) => (
   <Marker key={pin.id}
     onPress={()=>this.displayHouse(pin.id)}
     coordinate={pin.coordinate}/>
   ))
 }

 displayHouse(_id) {
   this.props.navigation.navigate('HouseInfo', { _id })
 }

 render() {
   return (
     <View style={{flex: 1, height: 150}}>
       <View style={{padding: 30}}>
         <TouchableOpacity
           onPress={() => this.props.navigation.openDrawer()}>
           <MaterialIcons
             name="menu"
             size={24}
             style={{color: 'black'}}
             >
           </MaterialIcons>
         </TouchableOpacity>
         <TextInput>Browse Houses</TextInput>
       </View>
       <View>
       <TouchableOpacity>
         <Image source={'../menu.png'}></Image>
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
       {this.markerRender(this.state.pins)}
     />
     <ScrollView
       style={{flex: 1}}
       showsHorizontalScrollIndicator={true}
       horizontal={true}
       bounces={true}
       >
         {this.state.images.map(picture => (
           <TouchableOpacity>
           <Image source={{uri: `data:image/png;base64,${picture}`}} style={{height: 150, width: 150}}/>
           </TouchableOpacity>
         ))}
     </ScrollView>
   </View>
   )
 }
}
