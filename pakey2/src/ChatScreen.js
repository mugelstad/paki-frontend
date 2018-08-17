import React from 'react';
import { View, Text, ListView, TouchableOpacity } from 'react-native';

export default class MessagesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offers: [],
      house: {} //house of receiver and sender
    }
  }
  componentDidMount(){
    console.log('@@id', this.props.navigation.getParam('id'))
    fetch(`http://eecea53d.ngrok.io/chat?id=${this.props.navigation.getParam('id')}`, {
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
          offers: responseJson.offers,
          house: responseJson.house
        })
      }
    })

  }
  render () {
    console.log(this.state.offers)
    return (
      <View style={{flex: 1}}>
          <View style={{padding: 20}}>
            <Text>House</Text>
            <Text>Address: {this.state.house.address}</Text>
            <Text>Monthly Rent: {this.state.house.monthlyRent}</Text>
            <Text>Square Feet: {this.state.house.sqft}</Text>
          </View>

        {this.state.offers.map(offer =>
          <View key={this.state.offers.indexOf(offer)}
            style=
            {(this.state.offers.indexOf(offer)%2 === 0) ? {padding: 20, borderRadius: 3,
               borderColor: "#66c2ff", borderWidth: 5, width: 150} :
               {padding: 20, borderRadius: 3,
                  borderColor: "gray", borderWidth: 5, width: 150, alignSelf: 'flex-end'}}
            >
            <Text style={{textAlign: "center"}}>{offer.amount}</Text>
          </View>)}
      </View>
    )
  }
}
