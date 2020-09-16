import React, { useState } from 'react';
import { View, Text, Alert, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import {buttonColor, linkColor} from '../../assets/colors';
// import database from '@react-native-firebase/database';
import { useSelector, useDispatch } from "react-redux";
import {textInputChangeFunc, checkFieldsValidity} from './../../commons/fieldsValidation';
// import auth from '@react-native-firebase/auth';
import validation from './../../utils/errorMessages';
import * as authActions from './../../store/actions/auth';
import { Link } from '@react-navigation/native';

const ForgotPassword = ({ navigation }) => {

    const [email, onChangeEmail] = useState('');

    const [emptyEmailField, onChangeEmptyEmailField] = useState(false);
    const [alreadyInUseField, onAlreadyInUseField] = useState(false);
    const [invalidEmailField, onInvalidEmailField] = useState(false);
    const [invalidPassField, onInvalidPassField] = useState(false);

    const [loadingText, setLoadingText] = useState(false);
    
    let emailTextInput;

    const navigateToSignup = () => {
        navigation.navigate('Signup');
    };

    const dispatch = useDispatch();

    const clearErrors = () => {
        onInvalidEmailField(false);
    };

    const validateEmail = (email) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    
        return expression.test(String(email).toLowerCase())
    };

    const fieldValueChangeFunc = (text, titleTextInput, type) => {
        if(type === 'email') {
            clearErrors();
            onChangeEmptyEmailField(textInputChangeFunc(text, titleTextInput));
            if (validateEmail(text)) {
                onInvalidEmailField(false);
            } else {
                onInvalidEmailField(true);
            }
            onChangeEmail(text);
        }
    };

    const resetPassword = async () => {
        setLoadingText(true);
        if (!invalidEmailField) {
            await dispatch(authActions.resetPassword(email));
            setLoadingText(false);
            Alert.alert("An email having Reset Password link has been sent! Check your inbox to proceed!", [{ text: "Okay" }]);
        }
    }

  return (
    <View style={ styles.mainContainer }>
        <View>
            <Text style={ styles.welcomeHeading }>Recover Account</Text>
            <Text style={ styles.welcomeText }>Put your recovery email and change your password from email</Text>

            <TextInput
                style={ styles.textInput }
                onChangeText={text => fieldValueChangeFunc(text, emailTextInput, 'email')}
                placeholder='Recovery Email Address'
                textContentType='emailAddress'
                ref={r=>emailTextInput=r}
            />
            {emptyEmailField && <Text style={ styles.errorMessage }>{validation.email.empty.message}</Text>}
            {alreadyInUseField && <Text style={ styles.errorMessage }>{validation.email.alreadyInUse.message}</Text>}
            {invalidEmailField && <Text style={ styles.errorMessage }>{validation.email.incorrect.message}</Text>}


            <TouchableOpacity activeOpacity = { .5 } style={ styles.placeholderButton } onPress={resetPassword}>
                {
                    !loadingText && (
                        <Text style={ styles.buttonText }>Submit</Text>
                    )
                }
                {
                    loadingText && (
                    <View style={ styles.loadingState }>
                        <Text style={ styles.buttonText }>Submitting...</Text>
                        <ActivityIndicator size="small" color='white' />
                    </View>
                    )
                }
            </TouchableOpacity>

            <Link style={ styles.linkText } to={'/Signin'}>Cancel</Link>

        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    placeholder: {
        width: 100,
        height: 100
    },
    welcomeHeading: {
        marginVertical: 15,
        fontStyle: 'normal',
        fontWeight: 'normal',
        textAlign: 'center',
        fontSize: 28,
        lineHeight: 34,
        color: '#151522',
    },
    welcomeText: {
        marginVertical: 15,
        fontStyle: 'normal',
        fontWeight: 'normal',
        textAlign: 'center',
        fontSize: 17,
        lineHeight: 22,
        width: 325,
        color: '#999999'
    },
    linkText: {
        marginVertical: 15,
        fontStyle: 'normal',
        fontWeight: 'normal',
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 20,
        width: 325,
        color: '#999999'
    },
    placeholderButton: {
        alignItems: "center",
        textAlign: 'center',
        backgroundColor: buttonColor,
        padding: 10,
        width: 325,
        height: 50,
        borderRadius: 5,
        marginTop: 40
    },
    appleButton: {
        backgroundColor: 'black',
    },
    googleButton: {
        backgroundColor: '#EA4335',
    },
    socialButtonsStyle: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'normal',
        fontSize: 16,
        lineHeight: 22
    },
    textInput: { 
        height: 50, 
        borderColor: '#999999', 
        borderWidth: 1,
        borderRadius: 5,
        width: 325,
        marginVertical: 10,
        paddingLeft: 20
    },
    loginText: {
        marginVertical: 15
    },
    loginLink: {
        color: linkColor
    },
    errorMessage: {
        color: 'red'
    },
    loadingState: {
        width: 150,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    }
});

export default ForgotPassword;