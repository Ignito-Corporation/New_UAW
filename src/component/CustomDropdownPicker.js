import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { appColors } from './Color';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class CustomDropdownPicker extends Component {
    state = {
        open: false,
        value: this.props.value || null,
    };

    setOpen = (open) => {
        this.setState({ open });
    };

    setValue = (callback) => {
        const value = callback(this.state.value);
        this.setState({ value });
        this.props.onValueChange(value);
    };

    render() {
        return (
            <View style={styles.dropdownContainer}>
                <DropDownPicker
                    searchable={true}
                    open={this.state.open}
                    value={this.state.value}
                    items={this.props.data}
                    setOpen={this.setOpen}
                    setValue={this.setValue}
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    placeholder={this.props.placeholder}
                    textStyle={styles.listText}

                    // 🔹 Full-screen modal mode
                    listMode="MODAL"
                    modalTitle={this.props.placeholder || "Select an option"}
                    modalAnimationType="slide"
                    modalContentContainerStyle={styles.modalContent}
                    modalTitleStyle={styles.modalTitle}

                    translation={{
                        SEARCH_PLACEHOLDER: "Search...",
                    }}
                    searchPlaceholderTextColor={appColors.fontColor}
                    searchContainerStyle={styles.searchContainerStyle}
                    searchTextInputStyle={styles.searchTextInputStyle}

                    ArrowUpIconComponent={() => (
                        <MaterialIcons name="keyboard-arrow-up" size={24} color={appColors.gray} />
                    )}
                    ArrowDownIconComponent={() => (
                        <MaterialIcons name="keyboard-arrow-down" size={24} color={appColors.gray} />
                    )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    dropdownContainer: {
        width: '100%',
        marginTop: 10,
    },
    dropdown: {
        backgroundColor: appColors.white,
        borderColor: appColors.primary,
        borderRadius: 10,
    },
    placeholderStyle: {
        fontFamily: 'Exo2-Regular',
        color: appColors.gray,
        fontSize: 15,
        paddingLeft: 10,
    },
    listText: {
        color: appColors.fontColor,
        fontFamily: 'Exo2-Regular',
        paddingLeft: 10,
    },
    searchContainerStyle: {
        borderWidth: 0,
        backgroundColor: appColors.bgColor,
    },
    searchTextInputStyle: {
        borderWidth: 0,
        color: appColors.fontColor,
        fontFamily: 'Exo2-Regular',
    },
    // 🔹 Full-screen modal styles
    modalContent: {
        backgroundColor: appColors.bgColor,
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: appColors.primary,
        padding: 15,
        textAlign: 'center',
        backgroundColor: appColors.white,
    },
});

export default CustomDropdownPicker;
