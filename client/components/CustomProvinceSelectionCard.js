import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Colors from '../constants/Colors';
import { provinces } from '../constants/Provinces';

const CustomProvinceSelectionCard = (props) => {
  const { toShow, toSet } = props;
  const provincesArr = provinces();

  const provinceSelection = (prov) => {
    toShow(false);
    toSet(prov);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {provincesArr.map((elem, index) => (
          <Pressable key={index} onPress={() => provinceSelection(elem)}>
            <Text style={styles.text}>{elem}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '86%',
    backgroundColor: '#fff',
    opacity: 1,
    borderWidth: 5,
    borderRadius: 10,
    borderColor: Colors.primary,
    //iOS shadow
    shadowColor: '#171717',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    //android shadow
    elevation: 10,
    shadowColor: '#000000',
  },
  innerContainer: {
    width: '100%',
    padding: 20,
    marginBottom: 5,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginVertical: 6,
    fontFamily: 'avenir-medium',
  },
});

export default CustomProvinceSelectionCard;
