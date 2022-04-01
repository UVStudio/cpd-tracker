import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

import CustomTextStats from './CustomTextStats';

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
        <CustomTextStats>
          You have completely satisfied {showYear}'s CPD requirements.
        </CustomTextStats>
      </View>
    );
  }

  if (remainingVer <= 0 && remainingTotalCPD <= 0 && remainingEthics > 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomTextStats>
          You still need {remainingEthics.toFixed(1)} Ethics hours to complete{' '}
          {showYear}'s CPD requirements'.
        </CustomTextStats>
      </View>
    );
  }

  if (remainingVer <= 0 && remainingTotalCPD > 0 && remainingEthics <= 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomTextStats>
          You have satisfied your Ethics and your Verifiable hours requirement
          for {showYear}, but you still need {remainingTotalCPD.toFixed(1)}{' '}
          hours of total CPD hours.
        </CustomTextStats>
      </View>
    );
  }

  //dangerous scenario
  if (remainingVer > 0 && remainingTotalCPD <= 0 && remainingEthics <= 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomTextStats>
          You have satisfied your Ethics and your total CPD hours requirement
          for {showYear}, but you still need {remainingVer.toFixed(1)} hours of
          Verifiable hours.
        </CustomTextStats>
      </View>
    );
  }

  if (remainingVer <= 0 && remainingTotalCPD > 0 && remainingEthics > 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomTextStats>
          You have satisfied the Verifiable hours requirement for {showYear},
          but you still need {remainingTotalCPD.toFixed(1)} hours of total CPD
          hours, as well as {remainingEthics.toFixed(1)} Ethics hours.
        </CustomTextStats>
      </View>
    );
  }

  if (remainingVer > 0 && remainingTotalCPD > 0 && remainingEthics <= 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomTextStats>
          You have satisfied your Ethics requirement for {showYear}, but you
          still need {remainingVer.toFixed(1)} hours of Verifiable hours, as
          well as {remainingTotalCPD.toFixed(1)} hours of total CPD hours.
        </CustomTextStats>
      </View>
    );
  }

  //dangerous scenario 2
  if (remainingVer > 0 && remainingTotalCPD <= 0 && remainingEthics > 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomTextStats>
          You have satisfied the CPD hours requirement for {showYear}, but you
          still need {remainingVer.toFixed(1)} hours of Verifiable hours, as
          well as {remainingEthics.toFixed(1)} Ethics hours.
        </CustomTextStats>
      </View>
    );
  }

  if (remainingVer > 0 && remainingTotalCPD > 0 && remainingEthics > 0) {
    return (
      <View style={styles.remainingHourscontainer}>
        <CustomTextStats>
          For {showYear}, you still need {remainingEthics.toFixed(1)} Ethics
          hours, {remainingVer.toFixed(1)} hours of Verifiable hours, as well as{' '}
          {remainingTotalCPD.toFixed(1)} hours of total CPD hours.
        </CustomTextStats>
      </View>
    );
  }

  return (
    <View style={styles.remainingHourscontainer}>
      <CustomTextStats>
        This data is being reflected by retro-actively uploaded sessions. The
        CPD Tracker app cannot calculate your CPD requirements for this
        particular year of {showYear}. It can only sum up how many hours from
        sessions you have uploaded.
      </CustomTextStats>
    </View>
  );
};

const styles = StyleSheet.create({
  remainingHourscontainer: {
    padding: 10,
    borderWidth: 2,
    borderColor: Colors.darkOrange,
  },
});

export default CustomRemainingHours;
