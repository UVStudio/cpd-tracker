import React, { useEffect, useRef } from 'react';
import { View, Text, Easing, Animated } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import Colors from '../constants/Colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CustomAnimatedPie = (props) => {
  let { required, progress } = props;
  if (progress > required) progress = required;
  const radius = 40;
  const strokeWidth = 20;
  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius;
  const circleRef = useRef();
  const animatedValue = useRef(new Animated.Value(0)).current;

  const pieColor = (required, progress) => {
    return required > progress ? Colors.light : Colors.brightGreen;
  };

  const animation = (toValue) => {
    return Animated.timing(animatedValue, {
      toValue,
      duration: 800,
      delay: 250,
      easing: Easing.in.cubic,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animation(progress);
    animatedValue.addListener((v) => {
      const maxPerc = (100 * v.value) / required;
      const strokeDashoffset =
        circleCircumference - (circleCircumference * maxPerc) / 100;
      if (circleRef?.current) {
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });
  }, []);

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg
        width={radius * 4}
        height={radius * 4}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <G rotation="-90" origin={(`${halfCircle}`, `${halfCircle}`)}>
          <Circle
            cy="50%"
            cx="50%"
            stroke={Colors.lightGrey}
            strokeWidth={strokeWidth}
            r={radius}
            fill="transparent"
            strokeOpacity={0.5}
          />
          <AnimatedCircle
            ref={circleRef}
            cy="50%"
            cx="50%"
            stroke={pieColor(required, progress)}
            strokeWidth={strokeWidth}
            r={radius}
            fill="transparent"
            strokeDasharray={circleCircumference}
            strokeDashoffset={circleCircumference}
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </View>
  );
};

export default CustomAnimatedPie;
