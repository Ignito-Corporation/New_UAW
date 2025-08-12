import React, { Component } from 'react';
import {
    View,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { appColors } from './Color';

class AutoCompleteInput extends Component {
    state = {
        query: '',
        filteredData: [],
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data !== prevState.prevData) {
            return {
                filteredData: nextProps.data || [],
                prevData: nextProps.data,
            };
        }
        return null;
    }

    handleSearch = (query) => {
        const { data } = this.props;

        if (query.trim() === '') {
            this.setState({ query, filteredData: [] });
            return;
        }

        const filteredData = data.filter((item) =>
            item?.label?.toLowerCase().includes(query.toLowerCase())
        );

        this.setState({ query, filteredData });
        this.props.handleChange(query);
    };

    handleSelect = (item) => {
        this.setState({ query: item.label, filteredData: [] });
        this.props.onSelect(item.value, item.label);
    };

    render() {
        const { query, filteredData } = this.state;
        const { style } = this.props;

        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={[styles.container, style]}
            >
                <TextInput
                    style={[styles.textInput, { height: 50 }]}
                    placeholder={this.props.placeholder || 'Search...'}
                    value={this.props.initialValue || query}
                    multiline={false}
                    onChangeText={this.handleSearch}
                />

                {query ? (
                    filteredData.length > 0 && (
                        <View style={styles.dropdownContainer}>
                            <FlatList
                                style={{ flexGrow: 0 }}
                                removeClippedSubviews={false}
                                nestedScrollEnabled={true}
                                keyboardShouldPersistTaps="handled"
                                data={filteredData}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.itemContainer}
                                        onPress={() => this.handleSelect(item)}
                                    >
                                        <Text style={styles.itemText}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                contentContainerStyle={styles.listContent}
                                showsVerticalScrollIndicator={true}
                            />
                        </View>
                    )
                ) : null}
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    textInput: {
        borderWidth: 1,
        backgroundColor: appColors.cardBg,
        borderColor: appColors.gray,
        borderRadius: 50,
        paddingHorizontal: 8,
        fontSize: 14,
        color: appColors.fontColor,
        fontFamily: 'Exo2-SemiBold',
    },
    dropdownContainer: {
        maxHeight: 200, // limit height to enable scrolling
        marginTop: 5,
        borderWidth: 1,
        borderColor: appColors.cardBorder,
        borderRadius: 5,
        backgroundColor: appColors.cardBg,
        overflow: 'hidden',
        flexGrow: 0, // prevent stretching
    },
    listContent: {
        paddingVertical: 5,
    },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: appColors.cardBorder,
    },
    itemText: {
        fontSize: 15,
        color: appColors.fontColor,
        fontFamily: 'Exo2-Regular',
    },
});

export default AutoCompleteInput;
