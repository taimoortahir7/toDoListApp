import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { View, Text, Image, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import {buttonColor, linkColor} from '../../assets/colors';
// import database from '@react-native-firebase/database';
import {textInputChangeFunc, checkFieldsValidity} from './../../commons/fieldsValidation';
// import auth from '@react-native-firebase/auth';
import validation from './../../utils/errorMessages';
import * as authActions from "../../store/actions/auth";
import { Link } from '@react-navigation/native';
// import {
//     GoogleSigninButton,
//     GoogleSignin,
//     statusCodes
// } from '@react-native-community/google-signin';
// import appleAuth, {
//     AppleButton,
//     AppleAuthRequestOperation,
//     AppleAuthRequestScope,
//     AppleAuthCredentialState,
//   } from '@invertase/react-native-apple-authentication';

const Signin = ({ navigation }) => {

    // GoogleSignin.configure();

    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');

    const [error, setError] = useState();

    const dispatch = useDispatch();

    // const [userInfo, setUserInfo] = useState();
    const [emptyEmailField, onChangeEmptyEmailField] = useState(false);
    const [emptyPasswordField, onChangeEmptyPasswordField] = useState(false);
    const [invalidEmailField, onInvalidEmailField] = useState(false);

    const [loadingText, setLoadingText] = useState(false);

    // const isSignedIn = async () => {
    //     const isSignedIn = await GoogleSignin.isSignedIn();
    //     if (isSignedIn) {
    //         navigateToSigninRoute();
    //     } else {
    //         signIn();
    //     }
    // };

    // const signIn = async () => {
    //     try {
    //       await GoogleSignin.hasPlayServices();
    //       const userInfo = await GoogleSignin.signIn();
    //       setUserInfo(userInfo);
    //       console.log('userInfo: ', userInfo);
    //       navigateToSigninRoute();
    //     } catch (error) {
    //       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //         // user cancelled the login flow
    //       } else if (error.code === statusCodes.IN_PROGRESS) {
    //         // operation (e.g. sign in) is in progress already
    //       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //         // play services not available or outdated
    //       } else {
    //         // some other error happened
    //       }
    //     }
    // };

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
            if (!invalidEmailField) {
                clearErrors();
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
        }
    };

    useEffect(() => {
        if (error) {
          Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
        }
    }, [error]);
    
    let emailTextInput, passwordTextInput;

    const navigateToSignup = () => {
        navigation.navigate('Signup');
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
        if(type === 'email') {
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

            {/* <Text style={ styles.linkText }>Or Sign in with</Text> */}

            {/* <TouchableOpacity activeOpacity = { .5 } style={ [styles.placeholderButton, styles.appleButton] } onPress={onAppleButtonPress}>
                <View style={styles.socialButtonsStyle}>
                    <View style={{borderRightWidth: 0.5, borderColor: 'white'}}>
                        <Image source={require('./../../assets/apple.png')} style={{marginRight: 10}}/>
                    </View>
                    <Text style={ styles.buttonText }>Continue with Apple</Text>
                    <View style={{borderLeftWidth: 0.5, borderColor: 'white'}}>
                        <Image source={require('./../../assets/rightArrow.png')} style={{marginLeft: 10}}/>
                    </View>
                </View>
            </TouchableOpacity> */}

            {/* <TouchableOpacity activeOpacity = { .5 } style={ [styles.placeholderButton, styles.googleButton] } onPress={isSignedIn}>
                <View style={styles.socialButtonsStyle}>
                    <View style={{borderRightWidth: 0.5, borderColor: 'white'}}>
                        <Image source={require('./../../assets/google.png')} style={{marginRight: 10}}/>
                    </View>
                    <Text style={ styles.buttonText }>Continue with Google</Text>
                    <View style={{borderLeftWidth: 0.5, borderColor: 'white'}}>
                        <Image source={require('./../../assets/rightArrow.png')} style={{marginLeft: 10}}/>
                    </View>
                </View>
            </TouchableOpacity> */}

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
        marginTop: 20,
        marginBottom: 20
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