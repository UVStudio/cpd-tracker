import { Text } from 'react-native';
import { CountUp } from 'use-count-up';
import Colors from '../constants/Colors';

const statsFraction = (num, num2, denom) => {
  return (
    <Text>
      <Text style={{ color: Colors.dark, fontSize: 20 }}>
        <CountUp
          isCounting
          start={0.0}
          end={num + num2}
          decimalPlaces={1}
          duration={1.5}
        />
      </Text>
      <Text>{'  /  '}</Text>
      <Text>{Number(denom).toFixed(1)}</Text>
    </Text>
  );
};

export default statsFraction;
