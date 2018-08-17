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
    console.log(this.state.offers)
    return (
      <View style={{flex: 1}}>
        {/* <View>
          <Text>House:</Text>
          <Text>Address: {this.state.house.address}</Text>
          <Text>Monthly Rent: {this.state.house.monthlyRent}</Text>
          <Text>Square Feet: {this.state.house.sqft}</Text>
        </View> */}
        {this.state.offers.map(offer =>
          <View key={this.state.offers.indexOf(offer)} style={{padding: 20}}>
            <Text>{offer.amount}</Text>
          </View>)}
      </View>
    )
  }
}
