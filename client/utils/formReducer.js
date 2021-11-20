import { FORM_INPUT_UPDATE, PASSWORD_INPUT_UPDATE } from '../store/types';

const formReducer = (state, action) => {
  if (
    action.type === FORM_INPUT_UPDATE ||
    action.type === PASSWORD_INPUT_UPDATE
  ) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  }
  return state;
};

export { formReducer };
