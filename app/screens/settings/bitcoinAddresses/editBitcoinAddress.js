import React, {Component} from 'react'
import {View, Alert, AsyncStorage, StyleSheet} from 'react-native'
import {NavigationActions} from 'react-navigation'
import EditBitcoinAddressComponent from './bitcoinAddressComponent'

export default class AddBankAccount extends Component {
  static navigationOptions = {
    title: 'Edit Bitcoin Address',
  }

  constructor(props) {
      super(props)
      const params = this.props.navigation.state.params.reference
      this.state = {
        id: params.id,
        address: params.address,
      }
   }

   updateAddress = (address) => {
      this.setState({address})
   }
   goToHome = () => {
    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({
          routeName: 'Home',
          params: {},

          // navigate can have a nested navigate action that will be run inside the child router
          action: NavigationActions.navigate({ routeName: 'Settings'}),
        }),
        NavigationActions.navigate({ routeName: 'SettingsBitcoinAddresses'}),
      ],
    })
    this.props.navigation.dispatch(resetAction)
   }
   update = async() => {
     //console.log(this.state)
     const value = await AsyncStorage.getItem('token')
     fetch('https://rehive.com/api/3/user/bitcoin_accounts/' + this.state.id + '/', {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + value,
        },
        body: JSON.stringify(this.state),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status === "success") {
          this.goToHome()
        }
        else {
          Alert.alert('Error',
            responseJson.message,
            [{text: 'OK'}])
        }
      })
      .catch((error) => {
        Alert.alert('Error',
            error,
            [{text: 'OK', onPress: () => console.log('OK Pressed!')}])
      })
   }

  render() {
    return (
      <View style={styles.container}>
        <EditBitcoinAddressComponent
          updateAddress={this.updateAddress}
          values={this.state}
          onPress={this.update}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'white',
    padding:15,
  },
})
