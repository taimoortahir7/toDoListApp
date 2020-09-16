import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { View, Text, Image, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import {buttonColor, linkColor} from '../../assets/colors';
// import database from '@react-native-firebase/database';
import {textInputChangeFunc, checkFieldsValidity} from './../../commons/fieldsValidation';
// import auth from '@react-native-firebase/auth';
import validation from './../../utils/errorMessages';
import * as authActions from "../../store/actions/auth";
// import { database } from './../../utils/firebase-config';

const Signup = ({ navigation }) => {

    const [name, onChangeName] = useState('');
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');
    // const [ConfPassword, onChangeConfPassword] = useState('');

    const [error, setError] = useState();

    const [emptyNameField, onChangeEmptyNameField] = useState(false);
    const [emptyEmailField, onChangeEmptyEmailField] = useState(false);
    const [emptyPasswordField, onChangeEmptyPasswordField] = useState(false);
    const [invalidEmailField, onInvalidEmailField] = useState(false);

    const [loadingText, setLoadingText] = useState(false);

    const dispatch = useDispatch();

    const authHandler = async () => {
        if (name === '' || email === '' || password === '') {
            Alert.alert("Fill out credentials!", [{ text: "Okay" }]);
            return;
        } else {
            if (!invalidEmailField) {
                clearErrors();
                let action;
                action = authActions.signup(
                    name,
                    email,
                    password
                );
                setError(null);
                setLoadingText(true);
                try {
                    await dispatch(action);
                    setLoadingText(false);
                    navigateToSigninRoute();
                } catch (err) {
                    console.log('err: ', err);
                    setError(err.message);
                    setLoadingText(false);
                }   
            }
        }
    };
    
    useEffect(() => {
        if (error) {
          Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
        }
    }, [error]);

    let nameTextInput, emailTextInput, passwordTextInput, CPasswordTextInput;

    const navigateToLogin = () => {
        navigation.navigate('Signin');
    };

    const navigateToSigninRoute = () => {
        navigation.navigate('bottomNavigation');
    };

    const clearErrors = () => {
        onInvalidEmailField(false);
    };

    const validateEmail = (email) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    
        return expression.test(String(email).toLowerCase())
    };
    
    const fieldValueChangeFunc = (text, titleTextInput, type) => {
        if(type === 'name') {
            onChangeEmptyNameField(textInputChangeFunc(text, titleTextInput));
            onChangeName(text);
        } else if(type === 'email') {
            clearErrors();
            onChangeEmptyEmailField(textInputChangeFunc(text, titleTextInput));
            if (validateEmail(text)) {
                onInvalidEmailField(false);
            } else {
                onInvalidEmailField(true);
            }
            onChangeEmail(text);
        } else if(type === 'password') {
            onChangeEmptyPasswordField(textInputChangeFunc(text, titleTextInput));
            onChangePassword(text);
        }
    };

  return (
    <View style={ styles.mainContainer }>
        <View>
            <Text style={ styles.welcomeHeading }>Create an Account</Text>
            <Text style={ styles.welcomeText }>Create your account to fully experience the app</Text>
        
            <TextInput
                style={ styles.textInput }
                onChangeText={text => fieldValueChangeFunc(text, nameTextInput, 'name')}
                placeholder='Full Name'
                textContentType='name'
                ref={r=>nameTextInput=r}
            />
            {emptyNameField && <Text style={ styles.errorMessage }>{validation.textFields.empty.message}</Text>}

            <TextInput
                style={ styles.textInput }
                onChangeText={text => fieldValueChangeFunc(text, emailTextInput, 'email')}
                placeholder='Email Address'
                textContentType='emailAddress'
                ref={r=>emailTextInput=r}
            />
            {emptyEmailField && <Text style={ styles.errorMessage }>{validation.email.empty.message}</Text>}
            {invalidEmailField && <Text style={ styles.errorMessage }>{validation.email.incorrect.message}</Text>}

            <TextInput
                style={ styles.textInput }
                onChangeText={text => fieldValueChangeFunc(text, passwordTextInput, 'password')}
                placeholder='Password'
                textContentType='password'
                secureTextEntry={true}
                ref={r=>passwordTextInput=r}
            />
            {emptyPasswordField && <Text style={ styles.errorMessage }>{validation.password.empty.message}</Text>}

            <TouchableOpacity activeOpacity = { .5 } style={ styles.placeholderButton } onPress={authHandler}>
                {
                    !loadingText && (
                        <Text style={ styles.buttonText }>Sign up</Text>
                    )
                }
                {
                    loadingText && (
                    <View style={ styles.loadingState }>
                        <Text style={ styles.buttonText }>Signing up...</Text>
                        <ActivityIndicator size="small" color='white' />
                    </View>
                    )
                }
            </TouchableOpacity>
        </View>
        <Text style={ styles.loginText }>I have account! <Text style={ styles.loginLink } onPress={navigateToLogin}>Sign in</Text></Text>
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

export default Signup;