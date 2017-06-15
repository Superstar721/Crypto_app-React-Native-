import React, { Component } from 'react'
import { View, Alert, StyleSheet } from 'react-native'
import { NavigationActions } from 'react-navigation'
import EditBitcoinAddressComponent from './bitcoinAddressComponent'
import SettingsService from './../../../services/settingsService'

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
    this.setState({ address })
  }
  goToHome = () => {
    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({
          routeName: 'Home',
          params: {},

          // navigate can have a nested navigate action that will be run inside the child router
          action: NavigationActions.navigate({ routeName: 'Settings' }),
        }),
        NavigationActions.navigate({ routeName: 'SettingsBitcoinAddresses' }),
      ],
    })
    this.props.navigation.dispatch(resetAction)
  }

  update = async () => {
    let responseJson = await SettingsService.editBitcoinAddresses(this.state.id, this.state)
    if (responseJson.status === "success") {
      this.goToHome()
    }
    else {
      Alert.alert('Error',
        responseJson.message,
        [{ text: 'OK' }])
    }
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
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
  },
})
