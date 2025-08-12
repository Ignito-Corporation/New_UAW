import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { appColors } from './Color';

const CustomCheckbox = ({ label, value, onToggle }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onToggle}>
            <View style={styles.box}>
                {value && <View style={styles.checked} />}
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

export default CustomCheckbox;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginVertical: 5,
    },
    box: {
        height: 20,
        width: 20,
        borderWidth: 2,
        borderColor: appColors.primary,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checked: {
        width: 12,
        height: 12,
        backgroundColor: appColors.primary,
    },
    label: {
        color: appColors.primary,
        fontSize: 14,
    },
});
