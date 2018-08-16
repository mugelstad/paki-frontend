import React from 'react';
import { Text, View, TouchableOpacity, Image, ScrollView, ImageBackground, TextInput} from 'react-native';
import { Camera, Permissions, ImagePicker, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button
} from 'react-native-elements';

export default class UploadScreen extends React.Component {

  static navigationOptions = {
    title: 'Upload',
    tabBarLabel: 'Upload'
  }

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    images: [],
    fontLoaded: null
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    .then()
    .catch(error => console.log(error))
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  //Fonts
  async componentDidMount() {
    // await Font.loadAsync({
    //   proximaNova: require('../assets/font/ProximaNova.ttf')
    // })
    // this.setState({fontLoaded: true})
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.cancelled) {
      var newArr = this.state.images.slice();
      newArr.push(result.uri)
      this.setState({ images: newArr });
    }
  };

  postPicture() {
    const apiUrl = 'http://b82a27f2.ngrok.io/upload';
    const formData = new FormData();

    this.state.images.forEach((photo) => {
      const uri = photo;
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append('photos[]', {
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      })
    })

    const options = {
      method: 'POST',
      body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      };

    fetch(apiUrl, options)
    .then((resp)=> resp.json())
    .then((json)=> this.props.navigation.navigate('Browse'))
    .catch((error) => console.error(error))
  }

  deletePicture = (photo) => {
    var arrayMinusOne = this.state.images.filter(img => !(img === photo));
    this.setState({images: arrayMinusOne})
  }

  render() {
  let { images } = this.state;

  return (

    <View style={{ flex: 1 }}>
      {this.state.fontLoaded ? (
        <Text style={{fontFamily: 'proximaNova', fontSize: 30}}>Update Home Info</Text>
      ) : null
      }
      <ScrollView style={{flex: 1}}>
        <View style={{flex:1, justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap'}}>
          {images &&
            images.map(photo => {
              return (
                <View key={photo} style={{ width: 110, height: 110, padding: 10}}>
                  <ImageBackground source={{ uri: photo }} style={{ width: 110, height: 110}}>
                    <TouchableOpacity onPress={() => this.deletePicture(photo)}>
                      <Ionicons type='evilicon' name="ios-close-circle" size={32} />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              )
             })
           }
         <TouchableOpacity onPress={this.pickImage}>
         <View style={{padding: 10}}>
           <Image source={{ uri: "https://d1elrd4d6l6916.cloudfront.net/assets/logo-placeholder-4a6b675f981c35903c038c0b826390bd1bd0bc8c7abfd1611a50d93522bd5df5.png" }}
              style={{ width: 110, height: 110 }}
            /></View>
         </TouchableOpacity>
        </View>
        <View style={{paddingBottom: 0, paddingLeft: 20, paddingRight: 20, paddingTop: 0}}>
        <Button raised title="Save Photos"
          style={{padding: 10}}
          onPress={() => this.postPicture()}
        />
        </View>
        <View style={{paddingBottom: 0, paddingLeft: 20, paddingRight: 20, paddingTop: 0}}>
          <Button raised title='Update House Info'
            backgroundColor={'blue'}
            style={{padding: 10}}
            onPress={() => {this.props.navigation.navigate('House')}}/>
        </View>
        <View style={{paddingBottom: 0, paddingLeft: 20, paddingRight: 20, paddingTop: 0}}>
          <Button raised title='Update Work Info'
            backgroundColor={'#66c2ff'}
            style={{padding: 10}}
            onPress={() => {this.props.navigation.navigate('Work')}}/>
        </View>
      </ScrollView>
    </View>
  );
}
}
