import React from 'react';
import { Text, View, TouchableOpacity, Button, Image, ScrollView } from 'react-native';
import { Camera, Permissions, ImagePicker } from 'expo';

export default class UploadScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    images: ["https://searchenginewatch.com/wp-content/uploads/sites/25/2016/08/thinking-emoji.png",
      "http://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-11/256/unamused-face.png"
            ]
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    .then()
    .catch(error => console.log(error))
    this.setState({ hasCameraPermission: status === 'granted' });
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

    const formArr = this.state.images.map(photo => {
      const uri = photo;
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      return ({
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      })
    })
    formData.append('photos', formArr);

    const options = {
      method: 'POST',
      body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      };
    return fetch(apiUrl, options);
  }

  // postPicture() {
  //   const apiUrl = 'https://ee4f8815.ngrok.io/upload';
  //   const uri = this.state.image;
  //   const uriParts = uri.split('.');
  //   const fileType = uriParts[uriParts.length - 1];
  //   const formData = new FormData();
  //     formData.append('photo', {
  //       uri,
  //       name: `photo.${fileType}`,
  //       type: `image/${fileType}`,
  //     });
  //   const options = {
  //     method: 'POST',
  //     body: formData,
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     };
  //   return fetch(apiUrl, options);
  // }

  render() {
  let { images } = this.state;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ScrollView>
      <Button
        title="Pick an image from camera roll"
        onPress={this.pickImage}
      />
      {images &&
        images.map(photo => {
          return ( <Image source={{ uri: photo }} style={{ width: 200, height: 200 }} />)
         })
       }
      <Button
        title="Save"
        onPress={() => this.postPicture()}
      />
      </ScrollView>
    </View>
  );
}
}
