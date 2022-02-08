import React, { useState, useEffect } from 'react';
import { PieChart } from 'react-native-svg-charts';
import Colors from '../constants/Colors';

const CustomPieChart = (props) => {
  const { required, progress } = props;

  const pieRemainder = (required, progress) => {
    return required - progress > 0 ? required - progress : 0;
  };

  const pieColor = (required, progress) => {
    return required - progress > 0 ? Colors.light : Colors.brightGreen;
  };

  return (
    <PieChart
      style={{ height: 160 }}
      valueAccessor={({ item }) => item.portion}
      spacing={1}
      outerRadius={'85%'}
      innerRadius={'50%'}
      data={[
        {
          key: 1,
          name: 'progress',
          portion: progress,
          svg: {
            fill: pieColor(required, progress),
          },
          animate: true,
          animationDuration: 1000,
        },
        {
          key: 2,
          name: 'remainder',
          portion: pieRemainder(required, progress),
          svg: { fill: Colors.lightGrey },
        },
      ]}
    />
  );
};

export default CustomPieChart;
