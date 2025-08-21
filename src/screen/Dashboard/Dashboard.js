import React, { Component } from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appColors } from '../../component/Color';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Dashboard extends Component {
    state = {
        userName: '',
    };
    async componentDidMount() {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData !== null) {
                const parsedData = JSON.parse(userData);
                this.setState({ userName: parsedData.name }); // Assuming 'name' is the key
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    }
    
    renderCard = (iconName, label, bgColor, count, iconColor) => {
        return (
            <View style={[styles.card, { backgroundColor: bgColor }]}>
                <View style={styles.left}>
                    <Icon name={iconName} size={30} color={iconColor} style={styles.icon} />
                    <Text style={styles.label}>{label}</Text>
                </View>
                <Text style={styles.count}>{count}</Text>
            </View>
        );
    };

    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.headText}>Welcome ,{this.state.userName}</Text>
                {this.renderCard('cash-register', 'Daily Sales', '#EAF6FF', '₹12,000', "#0484cf")}
                {this.renderCard('bank', 'Total Payable', '#F9F0F0', '₹18,200', "#d42f2f")}
                {this.renderCard('wallet', 'Total Receivable', '#EDF7ED', '₹22,800', "#3dcc3d")}
                {this.renderCard('clipboard-list', 'Total Pending Orders', '#FFF7E6', '34', "#d17411")}
                {this.renderCard('cash-multiple', 'Daily Collection', '#F3F6FC', '₹9,500', "#1d7fe0")}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: appColors.bgColor,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 16,
    },
    label: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    count: {
        fontSize: 16,
        fontWeight: '700',
        color: '#444',
    },
    headText:{
        fontFamily:'Exo2-Bold',
        color:appColors.primary,
        fontSize:16,
        paddingVertical:5
    }
});