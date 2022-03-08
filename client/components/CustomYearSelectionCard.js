import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Colors from '../constants/Colors';
//import { provinces } from '../constants/Provinces';

const CustomYearSelectionCard = (props) => {
  const { toShow, toSet, userHours } = props;
  // const provincesArr = provinces();

  //build years list for Custom Year Selection Card
  const yearsList = [];

  const yearsListBuild = () => {
    for (let i = 0; i < userHours.length; i++) {
      yearsList.push(userHours[i].year);
    }
  };
  yearsListBuild();

  console.log('yearsList: ', yearsList);

  const yearSelection = (year) => {
    toShow(false);
    toSet(year);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {yearsList.map((elem, index) => (
          <Pressable key={index} onPress={() => yearSelection(elem)}>
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

export default CustomYearSelectionCard;
