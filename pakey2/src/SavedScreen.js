import React from 'react';
import { View, Text, ListView, TouchableOpacity } from 'react-native';

export default class SavedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      houses: []
    }
  }

  static navigationOptions = {
    title: 'Saved'
  }

  componentDidMount(){
    fetch('http://eecea53d.ngrok.io/saved', {
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
          <View key={this.state.houses.indexOf(house)} style={{padding: 20}}>
            <TouchableOpacity style={{padding: 10}}>
              <Text>Address: {house.address}</Text>
              <Text>Monthly Rent: ${house.monthlyRent}</Text>
              <Text>Area: {house.sqft} sqft</Text>
            </TouchableOpacity>
          </View>)}
      </View>
    )
  }
}
