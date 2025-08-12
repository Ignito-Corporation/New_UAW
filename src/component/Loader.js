import React, { useEffect, useRef } from 'react';
import {
    Modal,
    StyleSheet,
    View,
    Animated,
    Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { appColors } from './Color';

const { width } = Dimensions.get('window');

const Loader = ({ visible = false }) => {
    const slideAnim = useRef(new Animated.Value(-width)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 12,
            }).start();
        } else {
            slideAnim.setValue(-width);
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
        >
            <View style={styles.overlay}>
                <Animated.View style={[styles.loaderContainer, { transform: [{ translateX: slideAnim }] }]}>
                    <LottieView
                        source={require('./../assets/animation/loader.json')}
                        autoPlay
                        loop
                        style={styles.lottie}
                    />
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderContainer: {
        width: 200,
        height: 200,
        backgroundColor: appColors.white,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        elevation: 10,
    },
    lottie: {
        width: 180,
        height: 180,
    },
});

export default Loader;
