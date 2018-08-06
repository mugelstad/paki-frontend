import React from 'react';
import { View, Text} from 'react-native'
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
    title: 'Register'
  });

  register(){
    fetch('http://localhost:1337/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.email,
        password: this.state.password,
      })
    }).then((resp)=> resp.json())
    .then(response => console.log('Success:', response))
    .catch(erro => console.error('Error:', console.error()))
  }

  render() {
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
            onChangeText={(text) => this.setState({password: text})}
            value={this.state.password}
          />
          <FormValidationMessage>
            {this.state.password ? null : 'this field is required'}
          </FormValidationMessage>
        </View>
        <Button raised title='submit'/>
      </View>
    )
  }
}
