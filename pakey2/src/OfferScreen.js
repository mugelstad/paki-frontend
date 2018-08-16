import React from 'react';
import { View, Text, ListView, TouchableOpacity } from 'react-native';

export default class MessagesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  static navigationOptions = {
    title: 'Offers'
  }

  componentDidMount(){
    fetch('http://b82a27f2.ngrok.io/offers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    .then(resp => resp.json())
    .then(responseJson => {
      if (responseJson.success) {
        this.setState({
          users: responseJson.users
        })
      }
    })
  }

  render () {
    return (
      <View style={{flex: 1}}>
        {this.state.users.map(user =>
          <View key={this.state.users.indexOf(user)} style={{padding: 20}}>
            <TouchableOpacity
              style={{padding: 10, borderRadius: 4, borderWidth: 0.5, borderColor: '#d6d7da'}}
              onPress={() => this.props.navigation.navigate('Chat', {id: user._id})}>
              <Text>{user.username}</Text>
              {/*<Text>address: {user.house.address}</Text>
              <Text>monthly rent: ${user.house.monthlyRent}</Text>
              <Text>area: {user.house.sqft} sqft</Text>*/}
            </TouchableOpacity>
          </View>)}
      </View>
    )
  }
}
