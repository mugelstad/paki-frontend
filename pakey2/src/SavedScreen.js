import React from 'react';
import { View, Text, ListView, TouchableOpacity } from 'react-native';

export default class SavedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      houses: []
    }
  }
  componentDidMount(){
    fetch('http://b82a27f2.ngrok.io/saved', {
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
          houses: responseJson.houses
        })
      }
    })

  }
  render () {
    return (
      <View style={{flex: 1}}>
        {this.state.houses.map(house =>
          <View style={{padding: 20}}>
            <TouchableOpacity style={{padding: 10}}>
              <Text>address: {house.address}</Text>
              <Text>monthly rent: ${house.monthlyRent}</Text>
              <Text>area: {house.sqft} sqft</Text>
            </TouchableOpacity>
          </View>)}
      </View>
    )
  }
}
