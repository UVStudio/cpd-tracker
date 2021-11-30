import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import * as nonVerActions from '../../store/actions/nonVer';
import * as userActions from '../../store/actions/user';

import CustomTitle from '../../components/CustomTitle';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomIndicator from '../../components/CustomIndicator';
import CustomScrollView from '../../components/CustomScrollView';
import CustomConfirmActionCard from '../../components/CustomConfirmActionCard';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomNonVerHoursDetails from '../../components/CustomNonVerHoursDetails';

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
      //await dispatch(nonVerActions.getAllNonVerObjsByYear(year));
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
          <CustomNonVerHoursDetails
            key={index}
            nonver={nonver}
            editSessionHandler={editSessionHandler}
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

export default NonVerHoursDetails;
