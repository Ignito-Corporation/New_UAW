// ImageSelector.js
import React, { Component } from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Platform,
    PermissionsAndroid,
    Dimensions
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { showMessage } from 'react-native-flash-message';

import scaledSize from './scaleSize';
import { appColors } from './Color';

export default class ImageSelector extends Component {
    state = {
        isVisible: false
    };

    requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'App needs camera permission to take pictures.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.error('Camera permission err:', err);
            return false;
        }
    };

    requestGalleryPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Gallery Permission',
                    message: 'App needs access to your gallery.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.error('Gallery permission err:', err);
            return false;
        }
    };

    openCamera = async () => {
        const hasPermission = Platform.OS === 'android'
            ? await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
            : true;

        if (!hasPermission) {
            const granted = await this.requestCameraPermission();
            if (!granted) return;
        }

        launchCamera(
            {
                mediaType: 'photo',
                saveToPhotos: true,
                maxWidth: 800,
                maxHeight: 600,
                quality: 0.5,
            },
            (response) => {
                this.handleImageResponse(response, 'Camera');
            }
        );
    };

    openGallery = async () => {
        // const hasPermission = Platform.OS === 'android'
        //     ? await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
        //     : true;

        // if (!hasPermission) {
        //     const granted = await this.requestGalleryPermission();
        //     if (!granted) return;
        // }

        launchImageLibrary(
            {
                mediaType: 'photo',
                maxWidth: 800,
                maxHeight: 600,
                quality: 0.5,
                selectionLimit: this.props.singleSelection ? 1 : 0
            },
            (response) => {
                this.handleImageResponse(response, 'Gallery');
            }
        );
    };

    handleImageResponse = (response, source) => {
        if (response.didCancel) {
            showMessage({
                message: `${source} selection cancelled`,
                position: "bottom",
                floating: true,
                animated: true,
                icon: "warning",
                type: "warning",
                titleStyle: { fontFamily: "Exo2-Regular", fontSize: 15, color: appColors.white },
                style: { borderRadius: 5, paddingHorizontal: 20 },
            });
            this.hide()
        } else if (response.errorCode) {
            console.error(`${source} Error:`, response.errorCode);
            showMessage({
                message: `Error selecting from ${source}`,
                position: "bottom",
                floating: true,
                animated: true,
                icon: "danger",
                type: "danger",
                titleStyle: { fontFamily: "Exo2-Regular", fontSize: 15, color: appColors.white },
                style: { borderRadius: 5, paddingHorizontal: 20 },
            });
            this.hide()
        } else if (response.assets && response.assets[0]) {
            this.hide();
            const imageUris = response.assets.map(asset => asset.uri); // Extract URIs
            this.props.onImageSelected(imageUris);
        }
    };

    show = () => this.setState({ isVisible: true });
    hide = () => this.setState({ isVisible: false });

    render() {
        return (
            <Modal
                transparent={true}
                visible={this.state.isVisible}
                onRequestClose={this.hide}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.overlay}
                        onPress={this.hide}
                        activeOpacity={1}
                    />
                    <View style={styles.modalContent}>
                        <View style={styles.modalInnerContent}>
                            <View style={styles.modalBtnContainer}>
                                <TouchableOpacity
                                    style={styles.modalIconContainer}
                                    onPress={this.openCamera}
                                >
                                    <Icon name='camera' size={40} color={appColors.primary} />
                                </TouchableOpacity>
                                <Text style={styles.modalText}>Camera</Text>
                            </View>
                            <View style={styles.modalBtnContainer}>
                                <TouchableOpacity
                                    style={styles.modalIconContainer}
                                    onPress={this.openGallery}
                                >
                                    <Icon name='images' size={40} color={appColors.primary} />
                                </TouchableOpacity>
                                <Text style={styles.modalText}>Gallery</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',

    },
    overlay: {
        flex: 1,
        backgroundColor: appColors.shadowColor,
    },
    modalContent: {
        backgroundColor: appColors.bgColor,
        // padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowColor: appColors.fontColor,
        position: 'absolute',
        width: Dimensions.get("window").width,
        height: Platform.OS == 'android' ? Dimensions.get('window').height / 4 : scaledSize(200),
        justifyContent: "center"
    },
    modalInnerContent: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    modalBtnContainer: {
        flexDirection: "column",
        alignItems: "center"
    },
    modalText: {
        fontSize: 16,
        fontFamily: "Exo2-Bold",
        color: appColors.fontColor,
        marginBottom: 15,
    },
    mealIcon: {
        width: 40,
        height: 40
    },
    modalIconContainer: {
        padding: 20,
        borderWidth: 1,
        borderColor: appColors.cardBorder,
        backgroundColor: appColors.cardBg,
        marginBottom: scaledSize(10),
        borderRadius: 50
    },
});