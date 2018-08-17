import React from 'react';
import { View, Text, Image, AsyncStorage} from 'react-native'
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button} from 'react-native-elements'

export default class LoginScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Login'
  });

  componentDidMount(){
    fetch('http://eecea53d.ngrok.io/findSession', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.success){
        this.props.navigation.navigate('Browse')
      }
    })
  }

  login(){
    fetch('http://eecea53d.ngrok.io/auth/local', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        username: this.state.email,
        password: this.state.password,
      })
    }).then(resp => resp.json())
    .then(responseJson => {
      console.log('@@afterlogin',responseJson);
      if (responseJson.user.house && responseJson.user.work) {
        this.props.navigation.navigate('Browse')
      } else if (responseJson.user.house) {
        this.props.navigation.navigate('Work')
      } else {
        this.props.navigation.navigate('House');
      }
    })
    .catch(error => console.log('Error:', error))
  }

  render() {
    const { navigate } = this.props.navigation;
    return(
      <View>
        <View>
          <FormLabel>EMAIL</FormLabel>
          <FormInput
            placeholder="email"
            onChangeText={(text) => this.setState({email: text})}
            value={this.state.email}
          />
          <FormValidationMessage>
            {this.state.email ? null : 'this field is required'}
          </FormValidationMessage>
        </View>
        <View>
          <FormLabel>PASSWORD</FormLabel>
          <FormInput
            placeholder="password"
            secureTextEntry={true}
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
          />
          <FormValidationMessage>
            {this.state.password ? null : 'this field is required'}
          </FormValidationMessage>
        </View>
        <Button raised title='submit'
          backgroundColor={'#66c2ff'}
          style={{padding: 10}}
          onPress={() => {
            this.login();
          }}/>
        <Button raised title='register'
          backgroundColor={'blue'}
          style={{padding: 10}}
          onPress={() => navigate('Register')}
        />
      </View>
    )
  }
}
