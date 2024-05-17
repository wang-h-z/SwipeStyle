import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import clothesJson from "../assets/clothesData/clothes.json";
import ClothesCard from "../components/ClothesCard";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    useDerivedValue,
    runOnJS,
} 
from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView} from "react-native-gesture-handler";
const AnimatedView = Animated.createAnimatedComponent(View);

export default function App() {
    const data = Object.values(clothesJson[0].data); //Might need to change this depending on how we scrape and clean the data
    const {width: screenWidth} = useWindowDimensions();

    const [currentIndex, setCurrentIndex] = useState(0);
    
    var currentCard = data[currentIndex];
    const nextCard = data[(currentIndex+1)%data.length];

    const translateX = useSharedValue(0);
    const contextX = useSharedValue(0);
    const rotation = useDerivedValue(() => interpolate(
        translateX.value,
        [0, screenWidth],
        [0, 20]
    ) + 'deg');

 
    
    //Rotation animation when swipping for main card
    const cardStyle = useAnimatedStyle(() => {
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

    //Growing animation for next card (Option to add opacity commented out)
    const nextCardStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(
                        translateX.value,
                        [-1.5*screenWidth, 0, 1.5*screenWidth],
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

    //Swipping logic
    const swipe = Gesture.Pan()
        .onBegin(() => {
            
            contextX.value = translateX.value;
        })
        .onChange((event) => {
            translateX.value = event.translationX + contextX.value;
            
            //console.log(translateX.value, event.velocityX); //To check how much card moved and speed of swipe for onEnd logic

        })
        .onEnd((event) => {
            //Swipe Speed < 800 && Amount card moved < 150
            
            if (Math.abs(event.velocityX) < 800 && Math.abs(event.translationX) < 150) {
              translateX.value = withSpring(0, {mass:0.5});
            } else {
                
                //Check to see which way card should be hidden
                translateX.value = withSpring(
                    1.5 * screenWidth * Math.sign(event.translationX),
                    {mass:0.15},
                    
                    () => {
                        
                        runOnJS(setCurrentIndex)(((currentIndex + 1)%data.length));
                        translateX.value = 0;
                        
                    }
                )
                        
                
                
            }

        })

        
    return (
        <View style={styles.pageContainer}>
            
            <View style={styles.nextCard}>
                <AnimatedView style={[nextCardStyle, styles.nextCard]}>
                    <ClothesCard clothesData={nextCard}/>
                </AnimatedView>
            </View>

            <GestureHandlerRootView>
            <GestureDetector gesture={swipe}>
                <AnimatedView style={[cardStyle, styles.animatedCard]}>
                    <ClothesCard clothesData={currentCard}/>
                </AnimatedView>
            </GestureDetector>
            </GestureHandlerRootView>
                
        </View>
    );

}

const styles = StyleSheet.create({
    
    pageContainer: {
        flex:1,
    },

    nextCard: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },

    animatedCard: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },

})
