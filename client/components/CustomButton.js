import React from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  Pressable,
  StyleSheet,
} from 'react-native';

import Colors from '../constants/Colors';

const CustomButton = (props) => {
  return (
    <View style={{ ...styles.buttonContainer, ...props.style }}>
      <View style={styles.shadow}>
        <TouchableHighlight
          style={styles.button}
          onPress={props.onSelect}
          underlayColor={Colors.light}
        >
          <Text style={styles.buttonText}>{props.children}</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '80%',
    marginVertical: 5,
  },
  button: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 15,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'sans-serif-condensed',
  },
  shadow: {
    shadowColor: '#888',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
});

export default CustomButton;
