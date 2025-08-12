import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { appColors } from './Color'; // Adjust path if needed

const CustomRadioGroup = ({ label, options, selected, onSelect }) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.optionsWrapper}>
                {options.map(option => (
                    <TouchableOpacity
                        key={option}
                        style={styles.option}
                        onPress={() => onSelect(option)}
                    >
                        <View style={styles.circle}>
                            {selected === option && <View style={styles.innerCircle} />}
                        </View>
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default CustomRadioGroup;

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    label: {
        fontWeight: '600',
        marginBottom: 5,
        color: appColors.primary,
    },
    optionsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%', // Two columns
        marginBottom: 10,
    },
    circle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: appColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: appColors.primary,
    },
    optionText: {
        marginLeft: 10,
        fontSize: 14,
        color: appColors.primary,
    },
});
