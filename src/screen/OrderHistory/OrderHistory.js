import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import axios from 'axios';
import { appColors } from '../../component/Color';
import CustomHeader from '../../component/CustomHeader';
import { OrderHistoryURL } from '../../component/URL';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class OrderHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchOrderHistory();
  }

  fetchOrderHistory = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const parsedUser = userData ? JSON.parse(userData) : null;

 
    try {
      const response = await axios.post(
        OrderHistoryURL,
        { user_id: parsedUser.id },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
console.log(response.data)
      if (response.status === 200 && response.data.orders) {
        this.setState({ orders: response.data.orders, loading: false });
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      console.error('Order history error:', error);
      this.setState({ loading: false });
    }
  };

  renderOrderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.orderTitle}>Order ID: {item.id}</Text>
        <Text style={styles.name}>Name: {item.name}</Text>
        <Text style={styles.email}>Email: {item.email}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
        <Text style={styles.date}>Date: {item.created_at?.split('T')[0]}</Text>

        <View style={styles.itemList}>
          <Text style={styles.subHeader}>Items:</Text>
          {item.items.map((productItem) => (
            <View key={productItem.id} style={styles.itemRow}>
              <Text style={styles.productText}>• {productItem.product.name} (Qty: {productItem.qty})</Text>
              <Text style={styles.productText}>Sr No: {productItem.product.sr_no}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  render() {
    const { orders, loading } = this.state;

    return (
      <View style={styles.container}>
        <CustomHeader title="Order History" navigation={this.props.navigation} />

        {loading ? (
          <ActivityIndicator size="large" color={appColors.primary} style={{ marginTop: 20 }} />
        ) : orders.length === 0 ? (
          <Text style={styles.emptyText}>No orders found.</Text>
        ) : (
          <FlatList
            data={orders}
            renderItem={this.renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:appColors.bgColor,
    },
    card: {
      backgroundColor: '#f5f5f5',
      margin: 10,
      padding: 15,
      borderRadius: 10,
      elevation: 3,
    },
    orderTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 6,
      color: '#333',
    },
    name: {
      fontSize: 14,
      color: '#444',
    },
    email: {
      fontSize: 14,
      color: '#444',
    },
    status: {
      fontSize: 14,
      color: '#666',
      marginTop: 4,
    },
    date: {
      fontSize: 14,
      color: '#666',
      marginBottom: 6,
    },
    itemList: {
      marginTop: 8,
    },
    subHeader: {
      fontWeight: 'bold',
      marginBottom: 4,
    },
    itemRow: {
      marginBottom: 5,
    },
    productText: {
      fontSize: 13,
      color: '#333',
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      color: '#888',
    },
  });
  
