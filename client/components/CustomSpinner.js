import React from 'react';
import { View, Easing, Animated } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';

const CustomSpinner = (props) => {
  const radius = 4;
  const strokeWidth = radius / 4;
  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius;

  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      easing: Easing.linear,
      useNativeDriver: true, // To make use of native driver for performance
    })
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 6],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        transform: [{ translateY: 2, rotate: spin }],
      }}
    >
      <Svg
        width={radius * 4}
        height={radius * 4}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <G>
          <Circle
            cy="50%"
            cx="50%"
            stroke="white"
            strokeWidth={strokeWidth}
            r={radius}
            fill="transparent"
            strokeOpacity={0.3}
          />
          <Circle
            cy="50%"
            cx="50%"
            stroke="white"
            strokeWidth={strokeWidth}
            r={radius}
            fill="transparent"
            strokeDasharray={circleCircumference}
            strokeDashoffset={circleCircumference / 2}
            strokeOpacity={1}
          />
        </G>
      </Svg>
    </Animated.View>
  );
};

export default CustomSpinner;
