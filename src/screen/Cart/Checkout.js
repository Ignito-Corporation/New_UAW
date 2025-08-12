import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CustomTextInput from '../../component/CustomTextInput';
import { appColors } from '../../component/Color';
import CustomHeader from '../../component/CustomHeader';
import { CheckoutURL } from '../../component/URL';
import moment from 'moment';
import { showMessage } from 'react-native-flash-message';

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: '',
            name: '',
            email: '',
            number: '',
            address: '',
            city: '',
            remark: '',
            cartItems: [],
            isLoading: true,
        };
    }

    async componentDidMount() {
        try {
            const userData = await AsyncStorage.getItem('userData');
            const parsedUser = userData ? JSON.parse(userData) : null;
            console.log("parsedUser",parsedUser)
            const cartData = await AsyncStorage.getItem('cart');
            const parsedCart = cartData ? JSON.parse(cartData) : [];
    
            if (parsedUser) {
                this.setState({
                    user_id: parsedUser.id,
                    name: parsedUser.name || '',
                    email: parsedUser.email || '',
                    number: parsedUser.phone || '',
                    cartItems: parsedCart,
                    isLoading: false, // ✅ Stop loader after data set
                });
            } else {
                this.setState({ cartItems: parsedCart, isLoading: false });
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.setState({ isLoading: false }); // even on error
        }
    }
    

   

    validateEmail = email => {
        const regex = /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
        return regex.test(email);
    };

    handleSubmit = async () => {
        const {
            name,
            email,
            number,
            address,
            city,
            remark,
            user_id,
            cartItems,
        } = this.state;
    
        if (!name.trim()) {
            showMessage({
                message: 'Please enter your name.',
                type: 'danger',
                icon: 'danger',
                floating: true,
            });
            return;
        }
    
        if (!this.validateEmail(email)) {
            showMessage({
                message: 'Please enter a valid email address.',
                type: 'danger',
                icon: 'danger',
                floating: true,
            });
            return;
        }
    
        if (!address.trim() || !city.trim()) {
            showMessage({
                message: 'Please enter your address and city.',
                type: 'danger',
                icon: 'danger',
                floating: true,
            });
            return;
        }
    
        const items = cartItems.map(item => ({
            product_id: item.id,
            qty: item.quantity || item.qty || 1,
            other_details: JSON.stringify({ notes: 'Handle with care' }),
        }));
    
        const payload = {
            user_id,
            name,
            email,
            phone: number,
            city,
            address,
            type: 'normal',
            shipped_to: name,
            shipped_address: address,
            payment_term: 'COD',
            remark,
            status: 'Pending',
            expected_delivery_date: moment().add(5, 'days').format('YYYY-MM-DD'),
            items,
        };
    
        console.log("payload", JSON.stringify(payload));
    
        try {
            const response = await axios.post(CheckoutURL, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.status === 200) {
                showMessage({
                    message: 'Order submitted successfully!',
                    type: 'success',
                    icon: 'success',
                    floating: true,
                });
                await AsyncStorage.removeItem('cart');
                this.props.navigation.goBack();
            } else {
                showMessage({
                    message: 'Order failed, please try again later.',
                    type: 'danger',
                    icon: 'danger',
                    floating: true,
                });
            }
        } catch (error) {
            console.error('Order API error:', error);
            showMessage({
                message: 'Something went wrong. Please try again.',
                type: 'danger',
                icon: 'danger',
                floating: true,
            });
        }
    };

    render() {
        const { name, email, number, address, city, remark, isLoading } = this.state;
    
        if (isLoading) {
            return (
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={appColors.primary} />
                </View>
            );
        }
    
        return (
            <View style={styles.container}>
                <CustomHeader title="Checkout" navigation={this.props.navigation} />
                <ScrollView contentContainerStyle={styles.innerContainer}>
                    <CustomTextInput
                        placeholder="Name"
                        value={name}
                        onChangeText={text => this.setState({ name: text })}
                    />
                    <CustomTextInput
                        placeholder="Email"
                        value={email}
                        keyboardType="email-address"
                        onChangeText={text => this.setState({ email: text })}
                    />
                    <CustomTextInput
                        editable={false}
                        placeholder="Number"
                        value={number}
                        keyboardType="phone-pad"
                    />
                    <CustomTextInput
                        placeholder="Address"
                        value={address}
                        onChangeText={text => this.setState({ address: text })}
                        multiline
                        textArea
                    />
                    <CustomTextInput
                        placeholder="City"
                        value={city}
                        onChangeText={text => this.setState({ city: text })}
                    />
                   
    
                    <TouchableOpacity style={styles.submitButton} onPress={this.handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit</Text>
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
    innerContainer: {
        padding: 20,
    },
    submitButton: {
        backgroundColor: appColors.primary,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#FFD580',
        fontSize: 16,
        fontFamily: 'Exo2-Bold',
    },
});

export default Checkout;
