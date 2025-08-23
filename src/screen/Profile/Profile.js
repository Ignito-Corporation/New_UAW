import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { appColors } from '../../component/Color';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: null,
      name: '',
      number: '',
    };
  }

  async componentDidMount() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const parsedUser = userData ? JSON.parse(userData) : null;

      if (parsedUser) {
        this.setState({
          name: parsedUser.name || '',
          number: parsedUser.phone || '',
        });
      }
    } catch (error) {
      console.log('Error retrieving user data:', error);
    }
  }

 

  handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              this.props.navigation.replace('Login');
            } catch (error) {
              console.log('Error clearing AsyncStorage:', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: this.deleteAccount,
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  deleteAccount = async () => {
    try {
      // Clear all user data from AsyncStorage
      await AsyncStorage.clear();
      
      // Navigate to login screen
      this.props.navigation.replace('Login');
      
      // Show success message
      showMessage({
        message: 'Your account has been successfully deleted',
        type: 'success',
        position: 'bottom',
        floating: true,
      });
    } catch (error) {
      console.log('Error deleting account:', error);
      showMessage({
        message: 'Failed to delete account. Please try again.',
        type: 'danger',
        position: 'bottom',
        floating: true,
      });
    }
  };

  render() {
    const { selectedImage, name, number } = this.state;

    return (
      <ScrollView>
      <View style={styles.container}>
        {/* Profile Image */}
        <View
          style={styles.imageContainer}
        >
         <View style={styles.dummyIcon}>
              <Icon name="person-circle-outline" size={120} color="#888" />
            </View>
        </View>

        {/* Username & Mobile (dynamic) */}
        <Text style={styles.username}>{name || 'Guest User'}</Text>
        <Text style={styles.mobile}>{number || '+91 -----------'}</Text>

        {/* Order History */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate('OrderHistory')}
        >
          <Icon name="receipt-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Order History</Text>
        </TouchableOpacity>

        {/* Account Actions */}
        <View style={styles.accountActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton]} 
            onPress={this.handleLogout}
          >
            <Text style={styles.actionButtonText}>Logout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={this.handleDeleteAccount}
          >
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete Account</Text>
          </TouchableOpacity>
        </View>

    
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: appColors.bgColor,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  dummyIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: 22,
    fontFamily: 'Exo2-Bold',
    color: appColors.fontColor,
    marginBottom: 4,
  },
  mobile: {
    fontSize: 16,
    color: appColors.fontColor,
    fontFamily: 'Exo2-Regular',
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: appColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountActions:{
    width: '90%',
    marginTop: 20,
  },
  actionButton:{
    backgroundColor: appColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText:{
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Exo2-Bold',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Exo2-Bold',
  },
  icon: {
    marginRight: 10,
  },
});
