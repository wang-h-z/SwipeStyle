import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder as PanResponder_, StyleSheet, View, useWindowDimensions, Text } from 'react-native';
import ClothesCard from "../components/ClothesCard";
import { useCart } from '../context/CartContext';
import { useLiked } from '../context/LikedContext';
import { ClothesCardProps } from '../types/ClothesCardProps';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AnimatedView = Animated.createAnimatedComponent(View);

interface SwipeCardProps {
    dummy: ClothesCardProps[];
}
const { width, height } = Dimensions.get('screen');

export const SIZES = {
    width,
    height,
};

const SwipeCard: React.FC<SwipeCardProps> = ({ dummy }) => {
    const [data, setdata] = useState(dummy);

    const position = useRef(new Animated.ValueXY()).current;

    const [currentIndex, setCurrentIndex] = useState(0);
    const currentCard = data[(currentIndex) % data.length];
    const nextCard = data[(currentIndex + 1) % data.length];

    const [start, setStart] = useState(currentCard.start);

    const [showLeftIcon, setShowLeftIcon] = useState(false);
    const [showRightIcon, setShowRightIcon] = useState(false);
    const [showUpIcon, setShowUpIcon] = useState(false);

    const [saved, setSaved] = useState(false);

    const leftTap = () => {
        setStart((prevStart) => prevStart === 0 ? currentCard.image.length - 1 : (prevStart - 1) % currentCard.image.length);
        console.log('left tap');
    };

    const rightTap = () => {
        setStart((prevStart) => (prevStart + 1) % currentCard.image.length);
        console.log('right tap');
    };

    const triggerRightSwipe = () => {
        console.log('save button');
        setSaved(true);
    }

    useEffect(() => {
        if (saved) {
            Animated.spring(position, {
                toValue: { x: SIZES.width + 100, y: 0 },
                useNativeDriver: false,
                mass: 0.5,
            }).start(() => {
                setStart(nextCard.start);
    
                if (data?.length / 2 < currentIndex) {
                    setdata([...data, ...dummy]);
                }
    
                setTimeout(() => {
                    setCurrentIndex(currentIndex + 1);
                    position.setValue({ x: 0, y: 0 });
                    setShowLeftIcon(false);
                    setShowRightIcon(false);
                    setShowUpIcon(false);
                    setSaved(false); // Reset the trigger
                }, 200);
            });
        }
    }, [saved]);

    const { addToCart } = useCart();
    const { addToLiked } = useLiked();

    const rotate = position.x.interpolate({
        inputRange: [-SIZES.width, 0, SIZES.width],
        outputRange: ['-20deg', '0deg', '20deg'],
        extrapolate: 'clamp'
    });

    const rotateAndTranslate = {
        transform: [{
            rotate: rotate
        },
        ...position.getTranslateTransform()
        ]
    };

    const nextCardScale = position.x.interpolate({
        inputRange: [-SIZES.width, 0, SIZES.width],
        outputRange: [1, 0.90, 1],
        extrapolate: 'clamp'
    });

    const PanResponder = PanResponder_.create({
        onStartShouldSetPanResponder: (evt, gestureState) => false,
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            const { dx, dy } = gestureState;
            return Math.abs(dx) > 5 || Math.abs(dy) > 5;
        },
        onPanResponderMove: (evt, gestureState) => {
            position.setValue({ x: gestureState.dx, y: Math.min(0, gestureState.dy) });

            if (gestureState.dx > 15) {
                setShowRightIcon(true);
                setShowLeftIcon(false);
                setShowUpIcon(false);

            } else if (gestureState.dx < -15) {
                setShowRightIcon(false);
                setShowLeftIcon(true);
                setShowUpIcon(false);
            }

            if (gestureState.dy < -15) {
                setShowUpIcon(true);
                setShowLeftIcon(false);
                setShowRightIcon(false);
            } else {
                setShowUpIcon(false);
            }

            if (data?.length / 2 < currentIndex) {
                setdata([...data, ...dummy]);
            }
        },
        onPanResponderRelease: (evt, gestureState) => {


            if (Math.abs(gestureState.dy) > 200 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx)) {
                console.log("Swipe up")
                Animated.spring(position, {
                    toValue: { x: Math.sign(gestureState.dx) * SIZES.width, y: -SIZES.height },
                    useNativeDriver: false,
                    friction: 4,
                }).start(() => {
                    addToCart(currentCard, start);
                    setStart(nextCard.start);
                });

                if (data?.length / 2 < currentIndex) {
                    setdata([...data, ...dummy]);
                }

                setTimeout(() => {
                    setCurrentIndex(currentIndex + 1);
                    position.setValue({ x: 0, y: 0 });
                    setShowLeftIcon(false);
                    setShowRightIcon(false);
                    setShowUpIcon(false);
                }, 200);
            } else if (gestureState.dx > 120) {
                console.log("Swipe right");
                Animated.spring(position, {
                    toValue: { x: SIZES.width + 100, y: 0 },
                    useNativeDriver: false,
                    mass: 0.5,
                }).start(() => {
                    addToLiked(currentCard, start);
                    setStart(nextCard.start);
                });

                if (data?.length / 2 < currentIndex) {
                    setdata([...data, ...dummy]);
                }

                setTimeout(() => {
                    setCurrentIndex(currentIndex + 1);
                    position.setValue({ x: 0, y: 0 });
                    setShowLeftIcon(false);
                    setShowRightIcon(false);
                    setShowUpIcon(false);
                }, 200);
            } else if (gestureState.dx < -120) {
                console.log("Swipe left");
                Animated.spring(position, {
                    toValue: { x: -SIZES.width - 100, y: 0 },
                    useNativeDriver: false,
                    mass: 0.5,
                }).start(() => {
                    setStart(nextCard.start);
                });

                if (data?.length / 2 < currentIndex) {
                    setdata([...data, ...dummy]);
                }

                setTimeout(() => {
                    setCurrentIndex(currentIndex + 1);
                    position.setValue({ x: 0, y: 0 });
                    setShowLeftIcon(false);
                    setShowRightIcon(false);
                    setShowUpIcon(false);
                }, 200);
            } else {
                setShowLeftIcon(false);
                setShowRightIcon(false);
                setShowUpIcon(false);
                console.log("Reset");
                Animated.spring(position, {
                    toValue: { x: 0, y: 0 },
                    friction: 4,
                    useNativeDriver: false,
                }).start();
            }
        }
    });

    const iconOpacity = position.x.interpolate({
        inputRange: [-SIZES.width, 0, SIZES.width],
        outputRange: [1, 0, 1],
        extrapolate: 'clamp'
    });
    const iconOpacityUp = position.y.interpolate({
        inputRange: [-SIZES.height, 0, SIZES.height],
        outputRange: [1, 0, 1],
        extrapolate: 'clamp'
    });

    return (
        <View style={styles.container}>
            {showLeftIcon && (
                <Animated.View style={[styles.iconContainer, { opacity: iconOpacity }]}>
                    <Ionicons name='close-circle' style={styles.icon} />
                </Animated.View>
            )}
            {showRightIcon && (
                <Animated.View style={[styles.iconContainer, { opacity: iconOpacity }]}>
                    <Ionicons name='heart-circle' style={styles.icon} />
                </Animated.View>
            )}
            {showUpIcon && (
                <Animated.View style={[styles.iconContainer, { opacity: iconOpacityUp }]}>
                    <Ionicons name='cart' style={styles.icon} />
                </Animated.View>
            )}

            {data?.map((item, i) => {
                if (i < currentIndex) {
                    return null;
                } else if (i == currentIndex) {
                    return (
                        <Animated.View
                            key={i}
                            {...PanResponder.panHandlers}
                            style={[rotateAndTranslate, styles.cardStyle]}
                        >
                            <ClothesCard
                                clothesData={item}
                                start={start}
                                setStart={setStart}
                                leftTap={leftTap}
                                rightTap={rightTap}
                                triggerRightSwipe={triggerRightSwipe}
                            />
                        </Animated.View>
                    );
                } else {
                    return (
                        <Animated.View
                            key={i}
                            style={[{
                                transform: [{ scale: nextCardScale }],
                            }, styles.cardStyle]}
                        >
                            <ClothesCard
                                clothesData={item}
                                start={item.start}
                                setStart={setStart}
                                leftTap={leftTap}
                                rightTap={rightTap}
                                triggerRightSwipe={triggerRightSwipe}
                            />
                        </Animated.View>
                    );
                }
            }).reverse()}
        </View>
    );
};

export default React.memo(SwipeCard);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardStyle: {
        height: '100%',
        width: SIZES.width,
        position: "absolute",
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    icon: {
        fontSize: 50,
    }
});
