import React from 'react';

import {
  TouchableOpacity,
  View,
  Image
} from 'react-native';

import PhotoUpload from 'react-native-photo-upload';



export default class uploadScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      image:0,
    }
  }

  static navigationOptions = {
    title: 'upload'
  };

  render() {
    return(
      <View>
        <plist version="1.0">
          <dict>
            ...
            <key>NSPhotoLibraryUsageDescription</key>
            <string>photo</string>
            <key>NSCameraUsageDescription</key>
            <string>camera</string>
          </dict>
        </plist>
        <TouchableOpacity>
        <PhotoUpload>
          <Image
            source={{
              uri: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg'
            }}
          />
        </PhotoUpload>
      </TouchableOpacity>x
      </View>
    )
  }

}
