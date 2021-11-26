import React, { useState, useEffect } from 'react';
import { Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import * as certsActions from '../../store/actions/cert';
import * as userActions from '../../store/actions/user';

import CustomTitle from '../../components/CustomTitle';
import CustomText from '../../components/CustomText';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomFaintThinGreyLine from '../../components/CustomFaintThinGreyLine';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomStatsInfoBox from '../../components/CustomStatsInfoBox';
import CustomIndicator from '../../components/CustomIndicator';
import CustomScrollView from '../../components/CustomScrollView';
import CustomConfirmActionCard from '../../components/CustomConfirmActionCard';
import CustomFullWidthContainer from '../../components/CustomFullWidthContainer';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomRowSpace from '../../components/CustomRowSpace';

import Colors from '../../constants/Colors';

const CertHoursDetails = (props) => {
  const { year } = props.route.params;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmCardText, setConfirmCardText] = useState('');
  const [deletingSession, setDeletingSession] = useState(false);
  const [verObjToDelete, setVerObjToDelete] = useState(null);

  const dispatch = useDispatch();

  const certsYearState = useSelector((state) => state.cert.certsYear);

  const loadCerts = async () => {
    setLoading(true);
    try {
      await dispatch(certsActions.getAllCertObjsByYear(year));
    } catch (error) {
      console.log(err.message);
      setLoading(false);
      setError(
        'There is something wrong with our network. Please try again later.'
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const deleteCardHandler = (item) => {
    setVerObjToDelete(item);
    setConfirmCardText(
      `Are you sure you want to delete this ${item.courseName} session?`
    );
  };

  const deleteSessionHandler = async () => {
    setDeletingSession(true);
    const imageId = verObjToDelete.img;
    try {
      await dispatch(certsActions.deleteCertObjById(verObjToDelete._id));
      await dispatch(certsActions.deleteUploadByCertImgId(imageId));
      await dispatch(certsActions.getAllCertObjsByYear(year));
      await dispatch(userActions.getUser());
      setVerObjToDelete(null);
      setDeletingSession(false);
      setConfirmCardText('');
    } catch (err) {
      setDeletingSession(false);
      setConfirmCardText('');
      setVerObjToDelete(null);
      console.log(err.message);
      setError(
        'There is something wrong with our network. We cannot delete your session at the moment. Please try again later.'
      );
    }
  };

  if (loading) {
    return <CustomIndicator />;
  }

  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <CustomTitle>Verifiable Hours for {year}</CustomTitle>
        <CustomGreyLine />
        {certsYearState.map((cert, index) => (
          <CustomFullWidthContainer key={index}>
            <CustomRowSpace>
              <CustomStatsInfoBox style={{ marginVertical: 5 }}>
                <CustomText>Course Name: {cert.courseName}</CustomText>
                <CustomText>Hours: {cert.hours}</CustomText>
                <CustomText>Ethics Hours: {cert.ethicsHours}</CustomText>
              </CustomStatsInfoBox>
              <Pressable
                style={{ alignSelf: 'center' }}
                onPress={() => deleteCardHandler(cert)}
              >
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color={Colors.darkGrey}
                  style={{ alignSelf: 'center' }}
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

export default CertHoursDetails;
