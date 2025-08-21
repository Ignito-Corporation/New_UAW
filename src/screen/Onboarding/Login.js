import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { appColors } from '../../component/Color';
import CustomTextInput from '../../component/CustomTextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { verifyPhoneURL } from '../../component/URL';
import scaledSize from '../../component/scaleSize';
import { showMessage } from 'react-native-flash-message';

const { width } = Dimensions.get('window');

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      showLoader: false,
    };
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () =>
      this.getIPAddress()
    );
  }

  async getIPAddress() {
    try {
      const IP = await AsyncStorage.getItem('ServerIP');
      const apiEndpoint = await AsyncStorage.getItem('APIEndpoint');
      if (IP != null) {
        this.setState({
          ServerIP: IP,
          Endpoint: apiEndpoint,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  handleLogin = async () => {
    const { mobile } = this.state;

    if (!mobile) {
      showMessage({
        message: 'Please enter your phone number',
        type: 'danger',
        position: 'bottom',
        floating: true,
        titleStyle: styles.flashText,
      });
      return;
    }

    const formData = new FormData();
    formData.append('phone', mobile);

    try {
      this.setState({ showLoader: true });

      const response = await axios.post(verifyPhoneURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('API Response:', response.data);

      if (response.data.status) {
        if (response?.data?.user) {
          await this.saveUserData(response.data.user);
        }

        if (response.data.isRegister) {
          this.props.navigation.navigate('MainTabs');
        } else {
          this.props.navigation.navigate('Register', {
            mobile: mobile,
            otp: response.data.otp,
          });
        }
      } else {
        showMessage({
          message: response.data.message || 'Invalid phone number',
          type: 'danger',
          position: 'bottom',
          floating: true,
          titleStyle: styles.flashText,
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      showMessage({
        message:
          error.response?.data?.message ||
          'An error occurred, please try again',
        type: 'danger',
        position: 'bottom',
        floating: true,
        titleStyle: styles.flashText,
      });
    } finally {
      this.setState({ showLoader: false });
    }
  };

  saveUserData = async (user) => {
    try {
      if (!user) {
        console.warn('No user data to save');
        return;
      }

      const jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem('userData', jsonValue);
      console.log('User data saved successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={styles.background}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <StatusBar backgroundColor="#FFE5B4" barStyle="dark-content" />

            <View style={styles.header}>
              <Text style={styles.title}>Welcome</Text>
              <Image
                source={require('./../../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.subtitle}>We are happy to serve you!</Text>
            </View>

            <View style={styles.bottomContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <CustomTextInput
                value={this.state.mobile}
                placeholder={'Enter your mobile'}
                returnKeyType="next"
                leftIcon={'call'}
                keyboardType='number-pad'
                onChangeText={(value) => this.setState({ mobile: value })}
              />

              <TouchableOpacity
                style={[
                  styles.signInButton,
                  !this.state.mobile && { backgroundColor: appColors.gray },
                ]}
                onPress={this.handleLogin}
                disabled={!this.state.mobile}
              >
                <Text style={styles.signInButtonText}>
                  {this.state.showLoader ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: appColors.bgColor,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'Exo2-Bold',
  },
  logo: {
    width: width * 0.5,
    height: 100,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    fontFamily: 'Exo2-SemiBold',
  },
  bottomContainer: {
    flex: 1,
    paddingTop: scaledSize(80),
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#222',
    fontFamily: 'Exo2-Regular',
  },
  signInButton: {
    width: '100%',
    height: 48,
    backgroundColor: appColors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signInButtonText: {
    color: appColors.white,
    fontSize: 16,
    fontFamily: 'Exo2-Bold',
  },
  flashText: {
    fontFamily: 'Exo2-Bold',
    fontSize: 14,
  },
});
