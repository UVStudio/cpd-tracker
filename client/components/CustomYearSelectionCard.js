import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Colors from '../constants/Colors';
import CustomTitle from './CustomTitle';
import CustomThinGreyLine from './CustomThinGreyLine';

const CustomYearSelectionCard = (props) => {
  const { toShow, toSet, userHours } = props;

  //build years list for Custom Year Selection Card
  const yearsList = [];

  const yearsListBuild = () => {
    for (let i = 0; i < userHours.length; i++) {
      yearsList.push(userHours[i].year);
    }
  };
  yearsListBuild();

  const yearSelection = (year) => {
    toShow(false);
    toSet(year);
  };

  const lastYear = yearsList.length - 1;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {yearsList.map((elem, index) => (
          <Pressable
            key={index}
            style={{ width: '100%' }}
            onPress={() => yearSelection(elem)}
          >
            <CustomTitle style={{ alignSelf: 'center', paddingBottom: 8 }}>
              {elem}
            </CustomTitle>
            {elem === yearsList[lastYear] ? null : <CustomThinGreyLine />}
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
    width: '80%',
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
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    marginVertical: 10,
    color: Colors.dark,
    alignSelf: 'center',
    fontFamily: 'avenir-medium',
  },
});

export default CustomYearSelectionCard;
