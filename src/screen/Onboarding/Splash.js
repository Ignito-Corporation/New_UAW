import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
} from 'react-native';

export default class Splash extends Component {
  async componentDidMount() {
    let isLogin = await AsyncStorage.getItem('userData');

    setTimeout(() => {
      if (isLogin) {
        this.props.navigation.replace('MainTabs');
      } else {
        console.log('Login');
        this.props.navigation.replace('Login');
      }
    }, 3000);
  }

  render() {
    return (
      <ImageBackground
        source={require('./../../assets/images/Splash.jpeg')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* You can add branding text or leave it as a clean splash */}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
