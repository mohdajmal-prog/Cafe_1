import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import Svg, { Circle, Ellipse, Path, G, Text as SvgText } from 'react-native-svg';

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

const AmbisCafeLogo = () => {
  return (
    <Svg width={240} height={240} viewBox="0 0 240 240">
      {/* Outer scalloped red badge */}
      <G>
        {/* Main red circle background */}
        <Circle cx={120} cy={95} r={85} fill="#8B2636" />
        
        {/* Lighter red accent */}
        <Circle cx={120} cy={95} r={80} fill="#B32F48" />
        
        {/* Character body/torso - skin tone */}
        <Ellipse cx={120} cy={130} rx={45} ry={55} fill="#E8B5A0" />
        
        {/* Head - skin tone */}
        <Circle cx={120} cy={70} r={42} fill="#E8B5A0" />
        
        {/* Hair - red */}
        <Path d="M 80 40 Q 75 15 120 10 Q 165 15 160 40 L 155 60 Q 120 55 85 60 Z" fill="#8B2636" />
        
        {/* Eyes */}
        <Circle cx={105} cy={65} r={4} fill="#000" />
        <Circle cx={135} cy={65} r={4} fill="#000" />
        
        {/* Eyebrows */}
        <Path d="M 100 58 Q 105 55 110 58" stroke="#000" strokeWidth={1.5} fill="none" />
        <Path d="M 130 58 Q 135 55 140 58" stroke="#000" strokeWidth={1.5} fill="none" />
        
        {/* Nose */}
        <Path d="M 120 65 L 120 75" stroke="#000" strokeWidth={1} fill="none" />
        
        {/* Smile */}
        <Path d="M 105 82 Q 120 92 135 82" stroke="#000" strokeWidth={2} fill="none" />
        
        {/* White badge background */}
        <Path d="M 75 110 Q 72 105 85 103 L 155 103 Q 168 105 165 110 L 170 125 Q 120 145 70 125 Z" fill="#FFFFFF" />
        
        {/* Badge text - Ambi's */}
        <SvgText x="120" y="128" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#B32F48" fontFamily="Arial">
          Ambi's
        </SvgText>
        
        {/* Badge text - Cafe */}
        <SvgText x="120" y="152" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#8B2636" fontFamily="Arial">
          Cafe
        </SvgText>
        
        {/* Shirt/torso details */}
        <Ellipse cx={120} cy={140} rx={30} ry={25} fill="#F5E6D3" />
        
        {/* Arms */}
        <Ellipse cx={75} cy={120} rx={15} ry={35} fill="#E8B5A0" transform="rotate(-30 75 120)" />
        <Ellipse cx={165} cy={120} rx={15} ry={35} fill="#E8B5A0" transform="rotate(30 165 120)" />
        
        {/* Thumbs up hand */}
        <G>
          <Circle cx={175} cy={100} r={10} fill="#E8B5A0" />
          <Path d="M 175 92 L 180 75 L 185 80 Z" fill="#E8B5A0" stroke="#000" strokeWidth={0.5} />
          <Circle cx={182} cy={88} r={3} fill="#000" />
        </G>
      </G>
    </Svg>
  );
};

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({
  onFinish,
}) => {
  const scaleAnim = useSharedValue(0.3);
  const opacityAnim = useSharedValue(0);
  const rotateAnim = useSharedValue(-45);

  useEffect(() => {
    const runAnimation = async () => {
      // Keep splash screen visible
      await SplashScreen.preventAutoHideAsync();

      // Fade in and scale up with rotation
      scaleAnim.value = withSequence(
        withTiming(1.15, {
          duration: 700,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(1, {
          duration: 200,
          easing: Easing.out(Easing.quad),
        })
      );

      rotateAnim.value = withSequence(
        withTiming(15, {
          duration: 700,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(0, {
          duration: 200,
          easing: Easing.out(Easing.quad),
        })
      );

      opacityAnim.value = withTiming(1, {
        duration: 400,
        easing: Easing.inOut(Easing.ease),
      });

      // Hide after 2.8 seconds
      setTimeout(async () => {
        await SplashScreen.hideAsync();
        onFinish();
      }, 2800);
    };

    runAnimation();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scaleAnim.value,
      },
      {
        rotate: `${rotateAnim.value}deg`,
      },
    ],
    opacity: opacityAnim.value,
  }));

  return (
    <View 
      style={{ 
        flex: 1, 
        backgroundColor: '#FFFFFF', 
        justifyContent: 'center', 
        alignItems: 'center',
      }}
    >
      <Animated.View style={animatedStyle}>
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={{ width: 240, height: 240 }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};
