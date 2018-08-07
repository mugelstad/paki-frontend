import React from 'react';
import { Text, View, TouchableOpacity, Button, Image, ScrollView } from 'react-native';
import { Camera, Permissions, ImagePicker, Font } from 'expo';

export default class UploadScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    images: [],
    fontLoaded: false
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    .then()
    .catch(error => console.log(error))
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  async componentDidMount() {
    await Font.loadAsync({
      proximaNova: require('../assets/font/ProximaNova.ttf')
    })
    this.setState({fontLoaded: true})

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
    const apiUrl = 'https://ee4f8815.ngrok.io/upload';
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
    .then((json)=> console.log(json))
    .catch((error) => console.error(error))
  }


  render() {
  let { images } = this.state;

  return (

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {this.state.fontLoaded ? (
        <Text style={{fontFamily: "proximaNova"}}>Update Home Info </Text>
      ) : null
      }
      <ScrollView>
        <View style={{flex:1, justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap'}}>
        {images &&
          images.map(photo => {
            return ( <View style={{padding: 3}} ><Image source={{ uri: photo }} style={{ width: 110, height: 110 }} /></View>)
           })
         }
         <TouchableOpacity onPress={this.pickImage}>
         <View style={{padding: 3}}>
           <Image source={{ uri: "https://d1elrd4d6l6916.cloudfront.net/assets/logo-placeholder-4a6b675f981c35903c038c0b826390bd1bd0bc8c7abfd1611a50d93522bd5df5.png" }}
              style={{ width: 110, height: 110 }}
            /></View>
         </TouchableOpacity>
        </View>
        <Button
          title="Save"
          onPress={() => this.postPicture()}
        />
      </ScrollView>
    </View>
  );
}
}
