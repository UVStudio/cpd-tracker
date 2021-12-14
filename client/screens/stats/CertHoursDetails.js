import React, { useState, useEffect } from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
import CustomCertHoursDetails from '../../components/CustomCertHoursDetails';

import Colors from '../../constants/Colors';

const CertHoursDetails = (props) => {
  const { year } = props.route.params;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmCardText, setConfirmCardText] = useState('');
  const [deletingSession, setDeletingSession] = useState(false);
  const [verObjToDelete, setVerObjToDelete] = useState(null);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const certsYearState = useSelector((state) => state.cert.certs);

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

  //this params needs to be called 'item' because of flexibility with CPD details screen
  const editCourseHandler = (item) => {
    navigation.navigate('Edit Verifiable Course', { item });
  };

  const deleteCardHandler = (cert) => {
    setVerObjToDelete(cert);
    setConfirmCardText(
      `Are you sure you want to delete this ${cert.courseName} session?`
    );
  };

  const deleteSessionHandler = async () => {
    setDeletingSession(true);
    const imageId = verObjToDelete.img;
    try {
      await dispatch(certsActions.deleteCertObjById(verObjToDelete._id));
      await dispatch(certsActions.deleteUploadByCertImgId(imageId));
      //await dispatch(certsActions.getAllCertObjsByYear(year));
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
          <CustomCertHoursDetails
            key={index}
            cert={cert}
            editCourseHandler={editCourseHandler}
            deleteCardHandler={deleteCardHandler}
          />
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
