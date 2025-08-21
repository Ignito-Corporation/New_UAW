import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { appColors } from './Color';

class DateSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPickerVisible: false,
    };
  }

  formatDate = (date) => {
    const day = (`0${date.getDate()}`).slice(-2);
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  showDatePicker = () => {
    this.setState({ isPickerVisible: true });
  };

  hideDatePicker = () => {
    this.setState({ isPickerVisible: false });
  };

  handleConfirm = (date) => {
    this.hideDatePicker();
    this.props.onChange(this.formatDate(date));
  };

  render() {
    const { value, placeholder } = this.props;
    const { isPickerVisible } = this.state;

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.dateInput} onPress={this.showDatePicker}>
          <Text style={[styles.dateText, !value && { color: appColors.gray }]}>
            {value || placeholder || 'Select Date'}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isPickerVisible}
          mode="date"
          maximumDate={new Date()}
          onConfirm={this.handleConfirm}
          onCancel={this.hideDatePicker}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
  },
  dateInput: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderColor: appColors.primary,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: appColors.white,
  },
  dateText: {
    fontSize: 16,
  },
});

export default DateSelector;
