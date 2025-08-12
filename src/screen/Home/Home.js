import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons  from 'react-native-vector-icons/Ionicons';
import { appColors } from '../../component/Color';
import PDFGenerator from '../../component/PDFGenerator';
import Carousel from '../../component/Carousel';
import axios from 'axios';
import { homeScreenBanner } from '../../component/URL';
import scaledSize from '../../component/scaleSize';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default class Home extends Component {
    state = {
        isModalVisible: false,
        image: [],
        userName: '',


    };
  async  componentDidMount() {
        this.fetchBannerData();
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

    fetchBannerData = async () => {
        try {
            const response = await axios.get(
                homeScreenBanner,
            );
            if (response.data?.status) {
                const banners = response.data.banners.map((item) => ({
                    uri: `https://argosmob.uk/uaw-auto/public/${item.image_path}`,
                    link: item.link,
                }));
                this.setState({ image: banners });
            }
        } catch (error) {
            console.error('Banner API error:', error);
        }
    };
    cards = [
        {
            title: 'Search By Category',
            icon: 'cog-outline', // gear icon
            bg: '#FFF6E5',
            color: appColors.primary,
            screen: 'SearchByCategoryScreen',
        },
        {
            title: 'Search By Vehicle',
            icon: null,
            customIcon: () => (
<View style={{ position: 'relative', width: 50, height: 40 }}>
    {/* Bus (behind) */}
    <Ionicons
        name="bus-outline"
        size={36}
        color="#FFF6E5"
        style={{
            position: 'absolute',
            top: 0,
            left: 1,
            backgroundColor: appColors.primary,
            borderRadius:100
        }}
    />
    {/* Car (front) */}
    <Icon
        name="car-outline"
        size={28}
        color="#FFF6E5"
        style={{
            position: 'absolute',
            bottom: -2,
            right: 2,
            backgroundColor: appColors.primary,
        }}
    />
</View>

            
            ),
            bg: appColors.primary,
            color: '#FFF6E5',
            screen: 'SearchByVehicleScreen',
        },
        
        
        {
            title: 'Search By Product',
            icon: 'clipboard-text-search-outline', // document icon
            bg: appColors.primary,
            color: '#FFF6E5',
            screen: 'SearchByProductNameScreen',
        },
        {
            title: 'Search by UAW Parts Number',
            icon: 'magnify', // search icon
            bg: '#FFF6E5',
            color: appColors.primary,
            screen: 'SearchByPartScreen',
        },
        {
            title: 'Contacts Us',
            icon: 'phone-outline', // phone icon
            bg: '#FFF6E5',
            color: appColors.primary,
            screen: 'ContactUs',
        },
        {
            title: 'Bulk Order',
            icon: 'shopping-outline', // shopping bag icon
            bg: appColors.primary,
            color: '#FFF6E5',
            screen: 'BulkOrderScreen',
        },
    ];

    handleCardPress = (item) => {
        if (item.screen) {
            this.props.navigation.navigate(item.screen);
        } else {
            alert(`No screen defined for: ${item.title}`);
        }
    };

render() {
    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.headText}>Welcome, {this.state.userName}</Text>
            <View style={styles.sliderContainer}>
                <Carousel data={this.state.image} slideInterval={2000} />
            </View>
            <View style={styles.cardContainer}>
            {this.cards.map((item, index) => (
    <TouchableOpacity
        key={index}
        style={[styles.card, { backgroundColor: item.bg }]}
        onPress={() => this.handleCardPress(item)}
    >
        {item.customIcon ? (
            item.customIcon()
        ) : (
            <Icon name={item.icon} size={40} color={item.color} />
        )}
        <Text style={[styles.cardText, { color: item.color }]}>
            {item.title}
        </Text>
    </TouchableOpacity>
))}


            </View>
        </ScrollView>
    );
}

}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingHorizontal: 10,
        paddingBottom:500,
        backgroundColor: '#FFFFFF',
    },
    sliderContainer: {
        // paddingHorizontal: 12,
        paddingTop: 5,
    },

    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: (width - 40) / 2,
        padding: 16,
        borderRadius: 12,
        marginBottom: 14,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    cardText: {
        marginTop: 10,
        fontSize: 14,
        fontFamily: 'Exo2-Bold',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
    },
    modalCardIcon: {
        marginRight: 16,
    },
    modalCardText: {
        fontSize: 16,
        fontWeight: '600',
    },
    closeBtnFull: {
        marginTop: 10,
        backgroundColor: appColors.primary,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeTextFull: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    headText:{
        fontFamily:'Exo2-Bold',
        color:appColors.primary,
        fontSize:16,
        padding:5
    }
});
