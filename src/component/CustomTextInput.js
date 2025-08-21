import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { appColors } from './Color';
import scaledSize from './scaleSize';

const CustomTextInput = ({
    onRef,
    placeholder,
    leftIcon,
    rightIcon,
    rightIconColor,
    rightIconText,
    onRightIconPress,
    value,
    onChangeText,
    onBlur,
    secureTextEntry = false,
    keyboardType = "default",
    style = {},
    multiline = false,
    textArea = false,
    editable = true,
    numberOfLines,
    leftIconColor,
    onSubmitEditing,
    inputFontSize,
    returnKeyType,
    onFocus
}) => {

    return (
        <View style={[styles.container, style, textArea || multiline ? styles.textAreaContainer : null]}>
            {leftIcon && <Icon name={leftIcon} color={leftIconColor || appColors.placeholderColor} size={24} />}
            <TextInput
                key={secureTextEntry ? 'password' : 'text'}
                ref={(input) => {
                    if (onRef) onRef(input);
                }}
                style={[
                    styles.input,
                    { fontSize: inputFontSize ? inputFontSize : 14 },
                    leftIcon ? { marginLeft: 10 } : {},
                    textArea ? styles.textAreaInput : {},
                ]}
                editable={editable}
                placeholder={placeholder}
                value={value}

                returnKeyType={returnKeyType ? returnKeyType : 'done'}
                keyboardType={keyboardType || 'default'}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                // multiline={textArea || multiline}
                placeholderTextColor={appColors.placeholderColor}
                cursorColor={appColors.primary}
                numberOfLines={numberOfLines || 1}
                onBlur={onBlur}
                textAlignVertical={textArea || multiline ? 'top' : 'center'}
                onSubmitEditing={onSubmitEditing}
                onFocus={onFocus}
                autoCapitalize="words"
            />
            {rightIcon && (
                <TouchableOpacity onPress={onRightIconPress} style={styles.iconContainer}>
                    <Icon name={rightIcon} size={24} color={rightIconColor || appColors.placeholderColor} />
                </TouchableOpacity>
            )}
            {rightIconText && (
                <TouchableOpacity onPress={onRightIconPress} style={{ ...styles.iconContainer, backgroundColor: appColors.primary, borderRadius: 15 }}>
                    <Text allowFontScaling={false} style={{ ...styles.rightText, fontSize: inputFontSize ? inputFontSize : 14 }}>{rightIconText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: appColors.primary,
        backgroundColor: appColors.white,
        borderRadius: 10,
        paddingHorizontal: 8,
        marginVertical: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 14,
        color: appColors.fontColor,
        fontFamily: "Exo2-SemiBold"
    },
    textAreaContainer: {
        borderRadius: 10, // Adjust border radius for TextArea
        height: 120, // Increase height for TextArea
        alignItems: 'flex-start', // Adjust alignment for multiline text
        paddingVertical: 10, // Add padding for multiline input
    },
    textAreaInput: {
        height: '100%', // Fill the container's height
        textAlignVertical: 'top', // Ensure text starts at the top
    },
    iconContainer: {
        padding: 5,
    },
    icon: {
        color: appColors.placeholderColor,
    },
    rightText: {
        color: appColors.white,
        fontSize: scaledSize(14),
        fontFamily: 'Exo2-SemiBold'

    }
});

export default CustomTextInput;
