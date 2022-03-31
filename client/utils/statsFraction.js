import { Text } from 'react-native';
import Colors from '../constants/Colors';

const statsFraction = (num, num2, denom) => {
  return (
    <Text>
      <Text style={{ color: Colors.dark, fontSize: 20 }}>
        {Number(num + num2).toFixed(1)}
      </Text>
      <Text>{'  /  '}</Text>
      <Text>{Number(denom).toFixed(1)}</Text>
    </Text>
  );
};

export default statsFraction;
