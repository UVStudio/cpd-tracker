import React, { useState, useEffect } from 'react';
import { Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import * as nonVerActions from '../../store/actions/nonVer';
import * as userActions from '../../store/actions/user';

import CustomTitle from '../../components/CustomTitle';
import CustomText from '../../components/CustomText';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomFaintThinGreyLine from '../../components/CustomFaintThinGreyLine';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomIndicator from '../../components/CustomIndicator';
import CustomStatsInfoBox from '../../components/CustomStatsInfoBox';
import CustomScrollView from '../../components/CustomScrollView';
import CustomConfirmActionCard from '../../components/CustomConfirmActionCard';
import CustomFullWidthContainer from '../../components/CustomFullWidthContainer';
import CustomScreenContainer from '../../components/CustomScreenContainer';

import Colors from '../../constants/Colors';
import CustomRowSpace from '../../components/CustomRowSpace';

const NonVerHoursDetails = (props) => {
  const { year } = props.route.params;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmCardText, setConfirmCardText] = useState('');
  const [deletingSession, setDeletingSession] = useState(false);
  const [nonVerToDeleteID, setNonVerToDeleteID] = useState('');

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const nonVerYearState = useSelector((state) => state.nonVer.nonver);

  const loadNonVer = async () => {
    setLoading(true);
    try {
      await dispatch(nonVerActions.getAllNonVerObjsByYear(year));
    } catch (err) {
      console.log(err.message);
      setLoading(false);
      setError(
        'There is something wrong with our network. Please try again later.'
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNonVer();
  }, []);

  const editSessionHandler = (nonver) => {
    navigation.navigate('Edit Non-Verifiable Session', { nonver });
  };

  const deleteCardHandler = (nonver) => {
    setNonVerToDeleteID(nonver._id);
    setConfirmCardText(
      `Are you sure you want to delete this ${nonver.sessionName} session?`
    );
  };

  const deleteSessionHandler = async () => {
    setDeletingSession(true);
    try {
      await dispatch(nonVerActions.deleteNonVerSession(nonVerToDeleteID));
      await dispatch(nonVerActions.getAllNonVerObjsByYear(year));
      await dispatch(userActions.getUser());
      setDeletingSession(false);
      setConfirmCardText('');
    } catch (err) {
      setDeletingSession(false);
      setConfirmCardText('');
      console.log(err.message);
      setError(
        'There is something wrong with our network. We cannot delete your session at the moment. Please try again later.'
      );
    }
  };

  if (loading) {
    <CustomIndicator />;
  }

  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <CustomTitle>Non-Verifiable Hours for {year}</CustomTitle>
        <CustomGreyLine />
        {nonVerYearState.map((nonver, index) => (
          <CustomFullWidthContainer key={index}>
            <CustomRowSpace>
              <CustomStatsInfoBox style={{ marginVertical: 5 }}>
                <Pressable onLongPress={() => editSessionHandler(nonver)}>
                  <CustomText>Session Name: {nonver.sessionName}</CustomText>
                  <CustomText>Date: {nonver.date}</CustomText>
                  <CustomText>Hours: {nonver.hours}</CustomText>
                </Pressable>
              </CustomStatsInfoBox>
              <Pressable
                style={{ alignSelf: 'center' }}
                onPress={() => deleteCardHandler(nonver)}
              >
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color={Colors.darkGrey}
                />
              </Pressable>
            </CustomRowSpace>
            <CustomFaintThinGreyLine />
          </CustomFullWidthContainer>
        ))}
      </CustomScrollView>
      {error !== '' ? (
        <CustomErrorCard error={error} toShow={setError} />
      ) : null}
      {confirmCardText !== '' ? (
        <CustomConfirmActionCard
          text={confirmCardText}
          actionLoading={deletingSession}
          toShow={setConfirmCardText}
          confirmAction={deleteSessionHandler}
          buttonText="Yes! Delete session"
          savingButtonText="Deleting session..."
        />
      ) : null}
    </CustomScreenContainer>
  );
};

export default NonVerHoursDetails;
