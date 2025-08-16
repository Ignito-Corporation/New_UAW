// ImageModalViewer.js
import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, Image, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { appColors } from './Color';


const ImageModalViewer = ({ visible, imageUri, onClose }) => {
    return (
        <>
            {/* <StatusBar backgroundColor={appColors.white} barStyle={'dark-content'} /> */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <SafeAreaView style={styles.modalBackground}>
                    <View >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Icon name="close" size={30} color={appColors.primary} />
                        </TouchableOpacity>
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.fullImage}
                            resizeMode={'contain'}
                        />
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.8,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
        backgroundColor: appColors.white,
        borderRadius: 5,
    },
});

export default ImageModalViewer;
