import React from 'react';
import { View, Text, ListView, TouchableOpacity } from 'react-native';

export default class MessagesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offers: []
    }
  }
  componentDidMount(){
    console.log('@@id', this.props.navigation.getParam('id'))
    fetch(`http://b82a27f2.ngrok.io/chat?id=${this.props.navigation.getParam('id')}`, {
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
          offers: responseJson.offers
        })
      }
    })

  }
  render () {
    return (
      <View style={{flex: 1}}>
      {this.state.offers.map(offer =>
        <View style={{padding: 20}}>
          <TouchableOpacity
            style={{padding: 10, borderRadius: 4, borderWidth: 0.5, borderColor: '#d6d7da'}}>
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
