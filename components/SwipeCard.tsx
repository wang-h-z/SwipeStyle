import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import ClothesCard from "../components/ClothesCard";
import Animated, {
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
    data: ClothesCardProps[];
}

const SwipeCard: React.FC<SwipeCardProps> = ({ data }) => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentCard = data[(currentIndex) % data.length];
    const nextCard = data[(currentIndex + 1) % data.length];

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const contextX = useSharedValue(0);
    const contextY = useSharedValue(0);

    const { addToCart } = useCart();
        
    const rotation = useDerivedValue(() => interpolate(
        translateX.value,
        [0, screenWidth],
        [0, 20]
    ) + 'deg');

    const cardStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: rotation.value },
            ],
        };
    });

    const nextCardStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(
                        translateX.value,
                        [-1.5 * screenWidth, 0, 1.5 * screenWidth],
                        [1, 0.95, 1]
                    ),
                },
                {
                    scale: interpolate(
                        translateY.value,
                        [-1.5 * screenHeight, 0, 1.5 * screenHeight],
                        [1, 0.95, 1]
                    ),
                },
            ],
            opacity: interpolate(
                translateX.value,
                [-screenWidth, 0, screenWidth],
                [1, 0.8, 1]
            )
        };
    });

    const swipe = Gesture.Pan()
        .onBegin(() => {
            contextX.value = translateX.value;
            contextY.value = translateY.value;
        })
        .onChange((event) => {
            translateX.value = event.translationX + contextX.value;
            translateY.value = Math.min(0, event.translationY + contextY.value); 
        })
        .onEnd((event) => {
            if (Math.abs(event.velocityX) < 800 && Math.abs(event.translationX) < 150 && Math.abs(event.translationY) < 150) {
                translateX.value = withSpring(0, { mass: 0.5 });
                translateY.value = withSpring(0, { mass: 0.5 });
            } else {
                var direction = 'horizontal';
                if (Math.abs(event.translationX) < Math.abs(event.translationY) && event.translationY < 0) {
                    direction = 'vertical';
                }

                const value = direction === 'horizontal' 
                                             ? 1.5 * screenWidth * Math.sign(event.translationX) 
                                             : 1.0 * screenHeight * Math.sign(event.translationY);

                if (direction === 'horizontal') {
                    if (event.translationX > 0) {
                        console.log("User liked");
                    } else {
                        console.log("User dislike");
                    }
                    translateX.value = withSpring(value, { mass: 0.15 }, () => {
                        runOnJS(setCurrentIndex)((currentIndex + 1) % data.length);
                        translateX.value = 0;
                        translateY.value = 0;
                    });
                    
                } else {                    
                    runOnJS(addToCart)(currentCard);
                    console.log("Cart: " + currentCard.start)
                    console.log("Added to cart")
                    translateX.value = withSpring(1.5 * screenWidth * Math.sign(event.translationX))
                    translateY.value = withSpring(value, { mass: 0.25 }, () => {
                        runOnJS(setCurrentIndex)((currentIndex + 1) % data.length);
                        translateX.value = 0;
                        translateY.value = 0;
                    });
                }
            }
        });

    return (
        <View style={styles.pageContainer}>
            <View style={styles.nextCard}>
                <AnimatedView style={[nextCardStyle, styles.nextCard]}>
                    <ClothesCard clothesData={nextCard} />
                </AnimatedView>
            </View>

            <GestureHandlerRootView>
                <GestureDetector gesture={swipe}>
                    <AnimatedView style={[cardStyle, styles.animatedCard]}>
                        <ClothesCard clothesData={currentCard} />
                    </AnimatedView>
                </GestureDetector>
            </GestureHandlerRootView>
        </View>
    );
};

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
});

export default SwipeCard;

