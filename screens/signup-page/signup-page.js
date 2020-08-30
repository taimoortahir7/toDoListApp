import React, { useState } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import {buttonColor, linkColor} from '../../assets/colors';
import database from '@react-native-firebase/database';
import {textInputChangeFunc, checkFieldsValidity} from './../../commons/fieldsValidation';
import auth from '@react-native-firebase/auth';
import validation from './../../utils/errorMessages';
import AsyncStorage from '@react-native-community/async-storage';

const Signup = ({ navigation }) => {

    const [name, onChangeName] = useState('');
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');
    const [ConfPassword, onChangeConfPassword] = useState('');

    const [emptyNameField, onChangeEmptyNameField] = useState(false);
    const [emptyEmailField, onChangeEmptyEmailField] = useState(false);
    const [emptyPasswordField, onChangeEmptyPasswordField] = useState(false);
    const [alreadyInUseField, onAlreadyInUseField] = useState(false);
    const [invalidEmailField, onInvalidEmailField] = useState(false);
    const [invalidPassField, onInvalidPassField] = useState(false);

    const [loadingText, setLoadingText] = useState(false);
    
    let nameTextInput, emailTextInput, passwordTextInput, CPasswordTextInput;

    const navigateToLogin = () => {
        navigation.navigate('Signin');
    };

    const storeData = async (identity) => {
        try {
          await AsyncStorage.setItem('@name', identity.user._user.displayName);
          await AsyncStorage.setItem('@email', identity.user._user.email);
        } catch (e) {
          // saving error
        }
    };

    const clearErrors = () => {
        onAlreadyInUseField(false);
        onInvalidEmailField(false);
        onInvalidPassField(false);
    };

    const fieldValueChangeFunc = (text, titleTextInput, type) => {
        if(type === 'name') {
            onChangeEmptyNameField(textInputChangeFunc(text, titleTextInput));
            onChangeName(text);
        } else if(type === 'email') {
            clearErrors();
            onChangeEmptyEmailField(textInputChangeFunc(text, titleTextInput));
            onChangeEmail(text);
        } else if(type === 'password') {
            clearErrors();
            onChangeEmptyPasswordField(textInputChangeFunc(text, titleTextInput));
            onChangePassword(text);
        } else if(type === 'conf_password') {
            onChangeConfPassword(text);
            // if(password === ConfPassword) {
            //     titleTextInput.setNativeProps({
            //         borderColor: buttonColor,
            //         borderBottomWidth: 1
            //     });
            // } else {
            //     titleTextInput.setNativeProps({
            //         borderColor: 'red',
            //         borderBottomWidth: 1
            //     });
            // }
        }
    };

    const saveUserName = (identity) => {
        identity.user._user.displayName = name;
    };

    const addUserDB = () => {
        const newReference = database().ref('Users').push();

        newReference.set({
            name: name,
            email: email,
            password: password
        })
        .then(() => {
            console.log('User added!');
        });
    };

    const signup = () => {
        clearErrors();
        setLoadingText(true);
        const fields = [
            {
                value: name,
                reference: nameTextInput
            },
            {
                value: email,
                reference: emailTextInput
            },
            {
                value: password,
                reference: passwordTextInput
            },
            {
                value: ConfPassword,
                reference: CPasswordTextInput
            }
        ];
        if(checkFieldsValidity(fields)) {
            auth()
            .createUserWithEmailAndPassword(email, password)
            .then((identity) => {
                console.log('User account created & signed in!');
                saveUserName(identity);
                storeData(identity);
                addUserDB();
                navigation.navigate('bottomNavigation');
                setLoadingText(false);
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                    onAlreadyInUseField(true);
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                    onInvalidEmailField(true);
                }

                if (error.code === 'auth/weak-password') {
                    console.log('Password should be at least 6 characters!');
                    onInvalidPassField(true);
                }

                setLoadingText(false);
                console.error(error);
            });
        } else {
            setLoadingText(false);
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
            {alreadyInUseField && <Text style={ styles.errorMessage }>{validation.email.alreadyInUse.message}</Text>}
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
            {invalidPassField && <Text style={ styles.errorMessage }>{validation.password.incorrect.message}</Text>}

            <TouchableOpacity style={ styles.placeholderButton } onPress={signup}>
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