import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

import CustomText from './CustomText';
import CustomBoldText from './CustomBoldText';

const CustomRemainingHours = (props) => {
  const {
    currentYearNeedVerHours,
    currentYearNeedCPDHours,
    currentYearNeedEthicsHours,
    verifiable,
    nonVerifiable,
    ethics,
    showYear,
  } = props;

  const remainingVer = currentYearNeedVerHours - verifiable;
  const remainingTotalCPD =
    currentYearNeedCPDHours - verifiable - nonVerifiable;
  const remainingEthics = currentYearNeedEthicsHours - ethics;

  if (remainingVer <= 0 && remainingTotalCPD <= 0 && remainingEthics <= 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomText>
          You have completely satisfied {showYear}'s CPD requirements.
        </CustomText>
      </View>
    );
  }

  if (remainingVer <= 0 && remainingTotalCPD <= 0 && remainingEthics > 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomText>
          You have enough Verifiable hours and your earned total CPD hours is
          same as the required amount, but you still need:
        </CustomText>
        <View style={styles.statsContainer}>
          <CustomBoldText>
            {remainingEthics.toFixed(1)} Ethics hours
          </CustomBoldText>
        </View>
        <CustomText>
          to completely satisfy your province's CPD requirement.
        </CustomText>
      </View>
    );
  }

  if (remainingVer <= 0 && remainingTotalCPD > 0 && remainingEthics <= 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomText>
          You have satisfied your Ethics and your Verifiable hours requirement
          for {showYear}, but you still need:
        </CustomText>
        <View style={styles.statsContainer}>
          <CustomBoldText>
            {remainingTotalCPD.toFixed(1)} total CPD hours
          </CustomBoldText>
        </View>
        <CustomText>
          to completely satisfy your province's CPD requirement.
        </CustomText>
      </View>
    );
  }

  //dangerous scenario
  if (remainingVer > 0 && remainingTotalCPD <= 0 && remainingEthics <= 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomText>
          You have satisfied your Ethics requirement. While your total CPD hours
          for {showYear} is same as the required amount, you still need to earn:
        </CustomText>
        <View style={styles.statsContainer}>
          <CustomBoldText>
            {remainingVer.toFixed(1)} Verifiable hours
          </CustomBoldText>
        </View>
        <CustomText>
          to completely satisfy your province's CPD requirement.
        </CustomText>
      </View>
    );
  }

  if (remainingVer <= 0 && remainingTotalCPD > 0 && remainingEthics > 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomText>
          You have satisfied the Verifiable hours requirement for {showYear},
          but you still need to earn:
        </CustomText>
        <View style={styles.statsContainer}>
          <CustomBoldText>
            {remainingEthics.toFixed(1)} Ethics hours
          </CustomBoldText>
          <CustomBoldText>
            {remainingTotalCPD.toFixed(1)} total CPD hours
          </CustomBoldText>
        </View>
        <CustomText>
          to completely satisfy your province's CPD requirement.
        </CustomText>
      </View>
    );
  }

  if (remainingVer > 0 && remainingTotalCPD > 0 && remainingEthics <= 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomText>
          You have satisfied your Ethics requirement for {showYear}, but you
          still need to earn:
        </CustomText>
        <View style={styles.statsContainer}>
          <CustomBoldText>
            {remainingVer.toFixed(1)} Verifiable hours
          </CustomBoldText>
          <CustomBoldText>
            {remainingTotalCPD.toFixed(1)} total CPD hours
          </CustomBoldText>
        </View>
        <CustomText>
          to completely satisfy your province's CPD requirement.
        </CustomText>
      </View>
    );
  }

  //dangerous scenario 2
  if (remainingVer > 0 && remainingTotalCPD <= 0 && remainingEthics > 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomText>
          Your amount of total earned CPD hours for {showYear} is same as the
          required amount, but you still need to earn:
        </CustomText>
        <View style={styles.statsContainer}>
          <CustomBoldText>
            {remainingVer.toFixed(1)} Verifiable hours
          </CustomBoldText>
          <CustomBoldText>
            {remainingEthics.toFixed(1)} Ethics hours
          </CustomBoldText>
        </View>
        <CustomText>
          to completely satisfy your province's CPD requirement.
        </CustomText>
      </View>
    );
  }

  if (remainingVer > 0 && remainingTotalCPD > 0 && remainingEthics > 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomText>For {showYear}, you need to earn:</CustomText>
        <View style={{ marginVertical: 5 }}>
          <CustomBoldText>
            {remainingVer.toFixed(1)} Verifiable hours
          </CustomBoldText>
          <CustomBoldText>
            {remainingEthics.toFixed(1)} Ethics hours.
          </CustomBoldText>
          <CustomBoldText>
            {remainingTotalCPD.toFixed(1)} total CPD hours
          </CustomBoldText>
        </View>
        <CustomText>
          to completely satisfy your province's CPD requirement.
        </CustomText>
      </View>
    );
  }

  return (
    <View style={styles.remainingHourscontainer}>
      <CustomText>
        This data is being reflected by retro-actively uploaded sessions. The
        CPD Tracker app cannot calculate your CPD requirements for this
        particular year of {showYear}. It can only sum up how many hours from
        sessions you have uploaded.
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  remainingHourscontainer: {
    padding: 10,
    borderWidth: 4,
    borderColor: Colors.darkOrange,
  },
  statsContainer: {
    marginVertical: 5,
  },
});

export default CustomRemainingHours;
