import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appColors } from '../../component/Color';
import CustomHeader from '../../component/CustomHeader';

export default class ContactUs extends Component {
  phoneNumbers = [
    { id: 1, number: '9888763501' },
    { id: 2, number: '9814164501' },
    { id: 3, number: '9814061050' },
    { id: 4, number: '9876500522' },
    { id: 5, number: '9193800027' },
  ];

  handleAddressPress = () => {
    const address = 'UAW Auto Parts Private Limited, 44- Industrial Area, Phagwara - 144401 (PB)';
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
    });

    Linking.openURL(url).catch(() => {
      const webUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      Linking.openURL(webUrl).catch(err => console.error('Failed to open maps:', err));
    });
  };

  handleEmailPress = () => {
    const email = 'uaw@uawauto.com';
    const subject = 'Inquiry';
    const body = 'Hello,\n\nI would like to ask about...';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch(err =>
      console.error('Failed to open email client:', err)
    );
  };

  handleDialPress = phoneNumber => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log('Phone dialer is not supported on this device.');
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  renderPhoneItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.handleDialPress(item.number)} style={styles.phoneItem}>
      <Text style={styles.phoneNumber}>{item.number}</Text>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={styles.container}>
        <CustomHeader title={'Get In Touch'} navigation={this.props.navigation} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Domestic Contact */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="phone" size={24} color="#333" />
              <Text style={styles.cardTitle}>Contact (Domestic)</Text>
            </View>
            <FlatList
              data={this.phoneNumbers}
              keyExtractor={item => item.id.toString()}
              renderItem={this.renderPhoneItem}
            />
          </View>

          {/* Export Contact */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="language" size={24} color="#333" />
              <Text style={styles.cardTitle}>Contact (Exports)</Text>
            </View>
            <TouchableOpacity onPress={() => this.handleDialPress('9814000997')}>
              <Text style={styles.phoneNumber}>9814000997</Text>
              {/* <Text style={styles.linkText}>support@uawauto.com</Text> */}
            </TouchableOpacity>
          </View>

          {/* Address */}
          <TouchableOpacity onPress={this.handleAddressPress} style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="location-on" size={24} color="#333" />
              <Text style={styles.cardTitle}>Regd. Office</Text>
            </View>
            <Text style={styles.cardText}>
              UAW AUTO PRIVATE LIMITED {'\n'}
              <Text style={styles.linkText}>
                44, Industrial Area, {'\n'}
                Phagwara - 144401 (PB), {'\n'}
                Punjab (India)
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity onPress={this.handleEmailPress} style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="email" size={24} color="#333" />
              <Text style={styles.cardTitle}>Email Id</Text>
            </View>
            <Text style={styles.linkText}>uaw@uawauto.com</Text>
            <Text style={styles.linkText}>support@uawauto.com</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.bgColor,
  },
  scrollContent: {
    padding: 10,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Exo2-SemiBold',
    color: appColors.fontColor,
    marginLeft: 10,
  },
  cardText: {
    fontSize: 16,
    color: appColors.fontColor,
    lineHeight: 24,
    fontFamily: 'Exo2-Regular',
  },
  linkText: {
    fontSize: 16,
    color: appColors.primary,
    textDecorationLine: 'underline',
    lineHeight: 24,
  },
  phoneItem: {
    paddingVertical: 6,
  },
  phoneNumber: {
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});
