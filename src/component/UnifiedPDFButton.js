import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { appColors } from './Color';

const UnifiedPDFButton = ({
    data,
    title = 'Generate PDF',
    searchQuery = '',
    onPress,
    generatingPDF = false,
    pdfProgress = 0,
    disabled = false
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.pdfButton,
                    {
                        backgroundColor: generatingPDF ? appColors.gray : appColors.primary,
                        opacity: generatingPDF || disabled ? 0.7 : 1,
                    },
                ]}
                onPress={onPress}
                disabled={generatingPDF || disabled}
            >
                {generatingPDF ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="white" />
                        <Text style={styles.pdfButtonText}>
                            Generating PDF... {pdfProgress}%
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.pdfButtonText}>
                        📄 {title} ({data?.length || 0} items)
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    pdfButton: {
        backgroundColor: appColors.primary,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: appColors.shadowColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pdfButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Exo2-Bold',
        textAlign: 'center',
    },
});

export default UnifiedPDFButton; 