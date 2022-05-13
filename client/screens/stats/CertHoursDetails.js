import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import * as certsActions from '../../store/actions/cert';
import * as authActions from '../../store/actions/auth';

import CustomTitle from '../../components/CustomTitle';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomIndicator from '../../components/CustomIndicator';
import CustomScrollView from '../../components/CustomScrollView';
import CustomConfirmActionCard from '../../components/CustomConfirmActionCard';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomCertHoursDetails from '../../components/CustomCertHoursDetails';

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

  //console.log('certsYearState: ', certsYearState);

  const loadCerts = async () => {
    setLoading(true);
    try {
      await dispatch(certsActions.getAllCertObjsByYear(year))
        .then(() => {})
        .catch(() => {});
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
    const certId = verObjToDelete._id;
    try {
      dispatch(authActions.dataRefresh());
      await dispatch(certsActions.deleteUploadByCertImgId(certId));
      await dispatch(certsActions.deleteCertObjById(certId));
      //await dispatch(certsActions.getAllCertObjsByYear(year));
      await dispatch(authActions.getUser());
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
