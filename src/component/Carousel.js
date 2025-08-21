import React, { Component } from 'react';
import { View, FlatList, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { appColors } from './Color';
import scaledSize from './scaleSize';


const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = screenWidth - 20;

class Carousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
        };
        this.flatListRef = React.createRef();
        this.viewabilityConfig = {
            viewAreaCoveragePercentThreshold: 50,
        };
    }

    componentDidMount() {
        this.startAutoSlide();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.slideInterval !== this.props.slideInterval) {
            this.startAutoSlide();
        }
    }

    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    startAutoSlide = () => {
        const { slideInterval = 3000, data } = this.props;

        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.intervalId = setInterval(() => {
            const { currentIndex } = this.state;
            const nextIndex = (currentIndex + 1) % data.length;

            if (this.flatListRef.current) {
                this.flatListRef.current.scrollToOffset({
                    offset: nextIndex * ITEM_WIDTH,
                    animated: true,
                });
                this.setState({ currentIndex: nextIndex });
            }
        }, slideInterval);
    };

    handleScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / ITEM_WIDTH);

        if (this.state.currentIndex !== index) {
            this.setState({ currentIndex: index });
        }
    };
    handleScrollBeginDrag = () => {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    };

    handleScrollEndDrag = () => {
        this.startAutoSlide();
    };

    renderItem = ({ item }) => {
        return (
            <View style={[styles.imageContainer, { width: ITEM_WIDTH }]}>
                <View style={styles.imageWrapper}>
                    <Image
                        source={this.props.type === 'url' ? { uri: item } : item}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>
            </View>
        );
    };

    render() {
        const { data } = this.props;
        const { currentIndex } = this.state;

        return (
            <View style={styles.outerContainer}>
                <View style={styles.container}>
                    <FlatList
                        ref={this.flatListRef}
                        data={data}
                        renderItem={this.renderItem}
                        removeClippedSubviews={false}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={this.handleScroll}
                        onScrollBeginDrag={this.handleScrollBeginDrag}
                        onScrollEndDrag={this.handleScrollEndDrag}
                        keyExtractor={(_, index) => index.toString()}
                        snapToInterval={ITEM_WIDTH}
                        snapToAlignment="center"
                        decelerationRate="fast"
                        getItemLayout={(_, index) => ({
                            length: ITEM_WIDTH,
                            offset: ITEM_WIDTH * index,
                            index,
                        })}
                        initialScrollIndex={0}
                    />
                    <View style={styles.pagination}>
                        {data.map((_, index) => (
                            <Text
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    index === currentIndex && styles.activeDot,
                                ]}
                            >
                                •
                            </Text>
                        ))}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outerContainer: {
        // paddingHorizontal: 10,
        marginVertical: 10,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: appColors.white,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    imageWrapper: {
        width: '100%',
        borderRadius: 15,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: scaledSize(200),
        resizeMode: 'contain',
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
    },
    paginationDot: {
        fontSize: 30,
        color: appColors.border,
        margin: 3,
    },
    activeDot: {
        color: appColors.primary,
    },
});

export default Carousel;
