import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder as PanResponder_, StyleSheet, View, useWindowDimensions } from 'react-native';
import ClothesCard from "../components/ClothesCard";
import {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    useDerivedValue,
    runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { useCart } from '../context/CartContext';
import { ClothesCardProps } from '../types/ClothesCardProps';
import { Image } from 'react-native';

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
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const [data, setdata] = useState(dummy)
    const position = useRef(new Animated.ValueXY()).current;


    const [currentIndex, setCurrentIndex] = useState(0);

    const currentCard = data[(currentIndex) % data.length];
    const nextCard = data[(currentIndex + 1) % data.length];

    const [start, setStart] = useState(currentCard.start);

    const leftTap = () => {
      setStart((prevStart) => prevStart === 0 ? currentCard.image.length - 1 : (prevStart - 1) % currentCard.image.length);
      //console.log('left tap')
    };
  
    const rightTap = () => {
      setStart((prevStart) => (prevStart + 1) % currentCard.image.length);
      
      //console.log('right tap')
    };
  
    const { addToCart } = useCart();
        
    const rotate = position.x.interpolate({
        inputRange: [-SIZES.width, 0, SIZES.width],
        outputRange: ['-20deg', '0deg', '20deg'],
        extrapolate: 'clamp'
    })
    const rotateAndTranslate = {
        transform: [{
            rotate: rotate
        },
        ...position.getTranslateTransform()
        ]
    }

    const nextCardScale = position.x.interpolate({
        inputRange: [-SIZES.width , 0, SIZES.width ],
        outputRange: [1, 0.90, 1],
        extrapolate: 'clamp'
    })

    const PanResponder = PanResponder_.create({
        onStartShouldSetPanResponder: (evt, gestureState) => false, // don't respond to taps
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            const { dx, dy } = gestureState;
            return Math.abs(dx) > 5 || Math.abs(dy) > 5; // minimum movement to recognize
        },
        onPanResponderMove: (evt, gestureState) => {
            position.setValue({ x: gestureState.dx, y: Math.min(0, gestureState.dy) });


            if (data?.length / 2 < currentIndex) {
                setdata([...data, ...dummy])
            }
        },
        onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dy < 120 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx)) {
                Animated.spring(position, {
                    toValue: { x: Math.sign(gestureState.dx) * SIZES.width, y: -SIZES.height },
                    useNativeDriver: false,
                    friction: 4,
                }).start(() => {
                    
                    addToCart(currentCard, start);
                    setStart(nextCard.start)
                })
                if (data?.length  / 2 < currentIndex) {
                    setdata([...data, ...dummy])
                }

                setTimeout(() => {
                    setCurrentIndex(currentIndex + 1)
                    position.setValue({ x: 0, y: 0 })
                }, 200)

                
                
                

            } else if (gestureState.dx > 120) {
                console.log("Swipe right")
                Animated.spring(position, {
                    toValue: { x: SIZES.width + 100, y: 0 },
                    useNativeDriver: false,
                    mass: 0.5,
                }).start(() => {
                    setStart(nextCard.start)
                })
                if (data?.length  / 2 < currentIndex) {
                    setdata([...data, ...dummy])
                }
                
                setTimeout(() => {
                    setCurrentIndex(currentIndex + 1)
                    position.setValue({ x: 0, y: 0 })
                }, 200)
                

            } else if (gestureState.dx < -120) {
                console.log("Swipe left")
                Animated.spring(position, {
                    toValue: { x: -SIZES.width - 100, y: 0 },
                    useNativeDriver: false,
                    mass: 0.5,
                }).start(() => {
                    setStart(nextCard.start)
                })
                if (data?.length  / 2 < currentIndex) {
                    setdata([...data, ...dummy])
                }
                
                setTimeout(() => {
                    setCurrentIndex(currentIndex + 1)
                    position.setValue({ x: 0, y: 0 })
                }, 200)
                

            } else {
                console.log("Reset")
                Animated.spring(position, {
                    toValue: { x: 0, y: 0 },
                    friction: 4,
                    useNativeDriver: false,
                }).start()
            }
        }
    })

    return data?.map((item, i) => {
        if (i < currentIndex) {
            return null
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
                    />
                </Animated.View>
            )
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
                    rightTap={rightTap} />
                </Animated.View>
            )
        }
    }).reverse()
};

export default React.memo(SwipeCard)

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
    },
    nextCard: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    animatedCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardStyle: {
        height: '100%',
        width: SIZES.width,
        position: "absolute",
        justifyContent:'center',
        alignItems:'center'
    },
});


