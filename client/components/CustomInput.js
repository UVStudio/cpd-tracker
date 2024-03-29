import React, { useReducer, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { INPUT_CHANGE, INPUT_BLUR } from '../store/types';
import currentYear from '../utils/currentYear';

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

const CustomInput = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : '',
    isValid: props.initiallyValid,
    touched: props.initialValue ? true : false,
  });

  const { onInputChange, id } = props;

  useEffect(() => {
    // if (inputState.touched) {
    //   onInputChange(id, inputState.value, inputState.isValid);
    // }
    onInputChange(id, inputState.value, inputState.isValid);
  }, [inputState, onInputChange, id]);

  const textChangeHandler = (text) => {
    const nameRegex = /[a-z\s]+$/gi;
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.id === 'email' && !emailRegex.test(text)) {
      isValid = false;
    }
    if (props.id === 'name' && !nameRegex.test(text)) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    if (props.id === 'year' && text.length !== 4) {
      isValid = false;
    }
    if (props.id === 'cpdYear' && Number(text) > currentYear) {
      isValid = false;
    }
    if (props.month && Number(text) > 13) {
      isValid = false;
    }

    dispatch({
      type: INPUT_CHANGE,
      value: text,
      isValid: isValid,
    });
  };

  const lostFocusHandler = () => {
    dispatch({ type: INPUT_BLUR });
  };

  return (
    <View style={styles.formControl}>
      {props.label ? <Text style={styles.label}>{props.label}</Text> : null}
      <TextInput
        {...props}
        style={styles.input}
        value={inputState.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocusHandler}
        returnKeyType="next"
      />
      {!inputState.isValid && inputState.touched && props.errorText ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: '100%',
  },
  label: {
    marginVertical: 2,
    marginTop: 4,
    fontFamily: 'avenir-medium',
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 4,
    paddingVertical: Platform.OS === 'android' ? 2 : 4,
    borderColor: '#ccc',
    borderWidth: 1,
    fontFamily: 'avenir-medium',
  },
  errorContainer: {
    marginVertical: 2,
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    fontFamily: 'avenir-medium',
  },
});

export default CustomInput;
