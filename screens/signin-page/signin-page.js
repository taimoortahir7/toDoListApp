import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { View, Text, Image, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import {buttonColor, linkColor} from '../../assets/colors';
import database from '@react-native-firebase/database';
import {textInputChangeFunc, checkFieldsValidity} from './../../commons/fieldsValidation';
import auth from '@react-native-firebase/auth';
import validation from './../../utils/errorMessages';
import AsyncStorage from '@react-native-community/async-storage';
import * as authActions from "../../store/actions/auth";
import { Link } from '@react-navigation/native';
import {
    GoogleSigninButton,
    GoogleSignin,
    statusCodes
} from '@react-native-community/google-signin';
import appleAuth, {
    AppleButton,
    AppleAuthRequestOperation,
    AppleAuthRequestScope,
    AppleAuthCredentialState,
  } from '@invertase/react-native-apple-authentication';
import { WEB_CLIENT_ID } from '../../utils/firebaseKey';

const Signin = ({ navigation }) => {

    GoogleSignin.configure();

    const [name, onChangeName] = useState('');
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');
    const [ConfPassword, onChangeConfPassword] = useState('');

    const [error, setError] = useState();

    const dispatch = useDispatch();

    const [userInfo, setUserInfo] = useState();
    const [emptyNameField, onChangeEmptyNameField] = useState(false);
    const [emptyEmailField, onChangeEmptyEmailField] = useState(false);
    const [emptyPasswordField, onChangeEmptyPasswordField] = useState(false);
    const [alreadyInUseField, onAlreadyInUseField] = useState(false);
    const [invalidEmailField, onInvalidEmailField] = useState(false);
    const [invalidPassField, onInvalidPassField] = useState(false);

    const [loadingText, setLoadingText] = useState(false);

    const isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
            navigateToSigninRoute();
        } else {
            signIn();
        }
    };

    const signIn = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          setUserInfo(userInfo);
          console.log('userInfo: ', userInfo);
          navigateToSigninRoute();
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
    };

    const onAppleButtonPress = async () => {
        Alert.alert("Currently not available!", [{ text: "Okay" }]);
        // if (!appleAuth.isSupported) {
        //     Alert.alert("iOS version not supported!", [{ text: "Okay" }]);
        // } else {
        //     // performs login request
        //     const appleAuthRequestResponse = await appleAuth.performRequest({
        //         requestedOperation: AppleAuthRequestOperation.LOGIN,
        //         requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
        //     });
         
        //     // get current authentication state for user
        //     // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
        //     const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
            
        //     // use credentialState response to ensure the user is authenticated
        //     if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        //         // user is authenticated
        //     }
        // }
      }
      

    const authHandler = async () => {
        if (email === '' || password === '') {
            Alert.alert("Fill out credentials!", [{ text: "Okay" }]);
            return;
        } else {
            let action;
        action = authActions.login(
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
                setError(err.message);
                setLoadingText(false);
            }
        }
    };

    useEffect(() => {
        if (error) {
          Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
        }
    }, [error]);
    
    let nameTextInput, emailTextInput, passwordTextInput, CPasswordTextInput;

    const navigateToSignup = () => {
        navigation.navigate('Signup');
    };

    const navigateToSigninRoute = () => {
        navigation.navigate('bottomNavigation');
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
            <Text style={ styles.welcomeHeading }>Lets Get Started</Text>
            <Text style={ styles.welcomeText }>Sign in or Login in to your favorite space and keep your tasks organized in projects</Text>

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

            <Link style={ styles.linkText } to={'/ForgotPassword'}>Forgot Password</Link>

            <TouchableOpacity activeOpacity = { .5 } style={ styles.placeholderButton } onPress={authHandler}>
                {
                    !loadingText && (
                        <Text style={ styles.buttonText }>Sign in</Text>
                    )
                }
                {
                    loadingText && (
                    <View style={ styles.loadingState }>
                        <Text style={ styles.buttonText }>Signing in...</Text>
                        <ActivityIndicator size="small" color='white' />
                    </View>
                    )
                }
            </TouchableOpacity>

            <Text style={ styles.linkText }>Or Sign in with</Text>

            <TouchableOpacity activeOpacity = { .5 } style={ [styles.placeholderButton, styles.appleButton] } onPress={onAppleButtonPress}>
                <View style={styles.socialButtonsStyle}>
                    <View style={{borderRightWidth: 0.5, borderColor: 'white'}}>
                        <Image source={require('./../../assets/apple.png')} style={{marginRight: 10}}/>
                    </View>
                    <Text style={ styles.buttonText }>Continue with Apple</Text>
                    <View style={{borderLeftWidth: 0.5, borderColor: 'white'}}>
                        <Image source={require('./../../assets/rightArrow.png')} style={{marginLeft: 10}}/>
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity = { .5 } style={ [styles.placeholderButton, styles.googleButton] } onPress={isSignedIn}>
                <View style={styles.socialButtonsStyle}>
                    <View style={{borderRightWidth: 0.5, borderColor: 'white'}}>
                        <Image source={require('./../../assets/google.png')} style={{marginRight: 10}}/>
                    </View>
                    <Text style={ styles.buttonText }>Continue with Google</Text>
                    <View style={{borderLeftWidth: 0.5, borderColor: 'white'}}>
                        <Image source={require('./../../assets/rightArrow.png')} style={{marginLeft: 10}}/>
                    </View>
                </View>
            </TouchableOpacity>

        </View>
        <Text style={ styles.loginText }>Create account! <Text style={ styles.loginLink } onPress={navigateToSignup}>Sign Up</Text></Text>
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

export default Signin;