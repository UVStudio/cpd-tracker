import React, { useEffect, useRef } from 'react';
import { Platform, Easing, Animated } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CustomSpinner = (props) => {
  const radius = 4;
  const strokeWidth = radius / 4;
  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius;
  const percentage = 80;
  const max = 100;

  const circleRef = useRef();

  const spinValue = new Animated.Value(0);
  const lengthValue = useRef(new Animated.Value(0)).current;

  const animation = (toValue) => {
    return Animated.timing(lengthValue, {
      toValue,
      duration: 800,
      easing: Easing.in.cubic,
      useNativeDriver: true,
    }).start(() => {
      animation(toValue === 0 ? percentage : 0);
    });
  };

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      easing: Easing.linear,
      useNativeDriver: true, // To make use of native driver for performance
    })
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    animation(percentage);
    lengthValue.addListener((v) => {
      const maxPerc = (100 * v.value) / max;
      const strokeDashoffset =
        circleCircumference - (circleCircumference * maxPerc) / 100;
      if (circleRef?.current) {
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });
  }, [percentage]);

  return (
    <Animated.View
      style={{
        transform: [
          { translateY: Platform.OS === 'ios' ? 8 : 2, rotate: spin },
        ],
      }}
    >
      <Svg
        width={radius * 4}
        height={radius * 4}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <G>
          <AnimatedCircle
            ref={circleRef}
            cy="50%"
            cx="50%"
            stroke="white"
            strokeWidth={strokeWidth}
            r={radius}
            fill="transparent"
            strokeDasharray={circleCircumference}
            strokeDashoffset={circleCircumference}
            strokeOpacity={1}
            strokeLinecap="round"
          />
          <Circle
            cy="50%"
            cx="50%"
            stroke="white"
            strokeWidth={strokeWidth}
            r={radius}
            fill="transparent"
            strokeOpacity={0}
          />
        </G>
      </Svg>
    </Animated.View>
  );
};

export default CustomSpinner;
