import React, { useState, useEffect, useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Transition, Transitioning } from 'react-native-reanimated';

import * as certsActions from '../../store/actions/cert';
import * as nonVerActions from '../../store/actions/nonVer';
import * as authActions from '../../store/actions/auth';

import CustomTitle from '../../components/CustomTitle';
import CustomSubtitle from '../../components/CustomSubtitle';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomIndicator from '../../components/CustomIndicator';
import CustomAccordionUnit from '../../components/CustomAccordionUnit';
import CustomScrollView from '../../components/CustomScrollView';
import CustomConfirmActionCard from '../../components/CustomConfirmActionCard';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomNonVerHoursDetails from '../../components/CustomNonVerHoursDetails';
import CustomCertHoursDetails from '../../components/CustomCertHoursDetails';

const TotalCPDHoursDetails = (props) => {
  const { year } = props.route.params;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHours, setShowHours] = useState(null);
  const [confirmCardText, setConfirmCardText] = useState('');
  const [deletingSession, setDeletingSession] = useState(false);
  const [verObjToDelete, setVerObjToDelete] = useState(null);
  const [nonVerToDeleteID, setNonVerToDeleteID] = useState('');
  const [verOrNonVer, setVerOrNonVer] = useState(null);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const ref = useRef();

  const certsYearState = useSelector((state) => state.cert.certs);
  const nonVerYearState = useSelector((state) => state.nonVer.nonver);

  const transition = (
    <Transition.Together>
      <Transition.In type="fade" durationMs={600} delayMs={200} />
      <Transition.Change />
      <Transition.Out type="fade" durationMs={200} />
    </Transition.Together>
  );

  const loadData = async () => {
    setLoading(true);
    try {
      await dispatch(nonVerActions.getAllNonVerObjsByYear(year));
      await dispatch(certsActions.getAllCertObjsByYear(year));
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
    loadData();
  }, []);

  const editSessionHandler = (item) => {
    if (item.sessionName) {
      navigation.navigate('Edit Non-Verifiable Session', { item });
    } else {
      navigation.navigate('Edit Verifiable Course', { item });
    }
  };

  const deleteCardHandler = (item) => {
    if (item.sessionName) {
      setVerOrNonVer('nonVer');
      setNonVerToDeleteID(item._id);
      setConfirmCardText(
        `Are you sure you want to delete this ${item.sessionName} session?`
      );
    } else {
      setVerOrNonVer('ver');
      setVerObjToDelete(item);
      setConfirmCardText(
        `Are you sure you want to delete this ${item.courseName} session?`
      );
    }
  };

  const deleteSessionHandler = async () => {
    setDeletingSession(true);
    try {
      dispatch(authActions.dataRefresh());
      if (verOrNonVer === 'nonVer') {
        await dispatch(nonVerActions.deleteNonVerSession(nonVerToDeleteID));
        //await dispatch(nonVerActions.getAllNonVerObjsByYear(year));
        setNonVerToDeleteID('');
      }
      if (verOrNonVer === 'ver') {
        const certId = verObjToDelete._id;
        await dispatch(certsActions.deleteCertObjById(certId));
        await dispatch(certsActions.deleteUploadByCertImgId(certId));
        //await dispatch(certsActions.getAllCertObjsByYear(year));
        setVerObjToDelete(null);
      }
      await dispatch(authActions.getUser());
      setDeletingSession(false);
      setConfirmCardText('');
    } catch (err) {
      setDeletingSession(false);
      setConfirmCardText('');
      setNonVerToDeleteID('');
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
    <Transitioning.View
      transition={transition}
      style={styles.container}
      ref={ref}
    >
      <CustomScreenContainer>
        <CustomScrollView>
          <CustomTitle>Total CPD Hours for {year}</CustomTitle>
          <CustomGreyLine />
          <CustomAccordionUnit>
            <Pressable
              onPress={() => {
                setShowHours('cert');
                ref.current.animateNextTransition();
              }}
            >
              <CustomSubtitle>Verifiable Hours</CustomSubtitle>
            </Pressable>
            <CustomThinGreyLine />
            {showHours === 'cert'
              ? certsYearState.map((cert, index) => (
                  <CustomCertHoursDetails
                    key={index}
                    cert={cert}
                    editCourseHandler={editSessionHandler}
                    deleteCardHandler={deleteCardHandler}
                  />
                ))
              : null}
          </CustomAccordionUnit>
          <CustomAccordionUnit>
            <Pressable
              onPress={() => {
                setShowHours('nonVer');
                ref.current.animateNextTransition();
              }}
            >
              <CustomSubtitle>Non-Verifiable Hours</CustomSubtitle>
            </Pressable>
            <CustomThinGreyLine />
            {showHours === 'nonVer'
              ? nonVerYearState.map((nonver, index) => (
                  <CustomNonVerHoursDetails
                    key={index}
                    nonver={nonver}
                    editSessionHandler={editSessionHandler}
                    deleteCardHandler={deleteCardHandler}
                  />
                ))
              : null}
          </CustomAccordionUnit>
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
    </Transitioning.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default TotalCPDHoursDetails;
