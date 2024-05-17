import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import ClothesCard from "./ClothesCard";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    useDerivedValue,
} 
from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
const AnimatedView = Animated.createAnimatedComponent(View);

interface ClothesData {
    name: string;
    desc: string;
    img: string;
}

export default function SwipeCard(props: {cardData:ClothesData}) {
    
    const {width: screenWidth} = useWindowDimensions();

    const translateX = useSharedValue(0);
    const contextX = useSharedValue(0);
    const rotation = useDerivedValue(() => interpolate(
        translateX.value,
        [0, screenWidth],
        [0, 30]
    ) + 'deg');

    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value
                },
                {
                    rotate: rotation.value
                },
            ],
        };
    });

    const swipe = Gesture.Pan()
        .onBegin(() => {
            contextX.value = translateX.value;
        })
        .onChange((event) => {
            translateX.value = event.translationX + contextX.value;

        })
        .onEnd((event) => {
            translateX.value = withSpring(translateX.value - event.translationX);
        })

    
    return (
        <GestureHandlerRootView>
            <GestureDetector gesture={swipe}>
                <AnimatedView style={[containerStyle, styles.animatedCard]}>
                    <ClothesCard clothesData={props.cardData}/>
                </AnimatedView>
            </GestureDetector>
        </GestureHandlerRootView>
                
            
            
    )

}

const styles = StyleSheet.create({
    
    animatedCard: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
      },

})