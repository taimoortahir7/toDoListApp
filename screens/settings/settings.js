import React, { useEffect, useState, useRef } from "react";
import { View, SafeAreaView, ActivityIndicator, TouchableOpacity, StyleSheet, Image, Text, TextInput } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import TaskItem from "../tasks-page/task-item/task-item";
import { database } from './../../utils/firebase-config';
import * as tasksActions from "../../store/actions/tasks";
import {buttonColor, linkColor} from '../../assets/colors';

const Settings = ({ navigation }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [image, setImage] = useState();

  const settingsList = [
    //   'General',
    //   'Help & Feedback',
      'Privacy Policy',
      'Terms & Conditions',
      // 'Security Policy'
  ];

  const userID = useSelector((state) => state.auth.userId);

  const findUserDetails = () => {
    database.ref('users/' + userID).on('value', function(snapshot) {
      let userObj = snapshot.val();
      if (userObj) {
        setName(userObj?.username);
        setEmail(userObj?.email);
        setPassword(userObj?.password);
        setImage(userObj?.image);
      }

    });
  };

//   const dispatch = useDispatch();

  useEffect(() => {
    findUserDetails();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={buttonColor} />
      </View>
    );
  }

  return (
    <SafeAreaView style={ [styles.safeArea] }>
        <View style={styles.headingDiv}>
            <Text style={styles.heading}>Settings</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile', {
          username: name,
          email: email,
          password: password
        })}>
          <View style={styles.personalView}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={require('./../../assets/profileImage.png')}/>
                  <View style={{ marginLeft: 20 }}>
                      <Text style={styles.nameText}>{name}</Text>
                      <Text style={styles.textInput}>{email}</Text>
                  </View>
              </View>
              <Image source={require('./../../assets/rightArrow.png')}/>
          </View>
        </TouchableOpacity>
        {
            (settingsList.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => {
                    if (item === 'Privacy Policy') {
                        navigation.navigate('PrivacyPolicy');
                    } else if (item === 'Terms & Conditions') {
                        navigation.navigate('TermsService');
                    } else if (item === 'Security Policy') {
                        navigation.navigate('SecurityPolicy');
                    }
                }}>
                    <View style={styles.listItem}>
                        <Text style={styles.nameText}>{item}</Text>
                        <Image source={require('./../../assets/rightArrow.png')}/>
                    </View>
                </TouchableOpacity>
            )))
        }

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    flex: 1
  },
  addProject: {
    alignItems: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  personalView: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      justifyContent: 'space-between',
      paddingVertical: 20,
      paddingHorizontal: 20,
      marginBottom: 20
    },
    headingDiv: {
        borderBottomWidth: 1,
        borderColor: '#E4E4E4',
        paddingVertical: 10,
        marginTop: 90,
        marginBottom: 20
    },
  heading: {
    fontWeight: 'bold',
    fontSize: 34,
    lineHeight: 41,
    marginLeft: 16
  },
  nameText: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 17,
    lineHeight: 22
  },
  textInput: { 
    fontWeight: 'normal',
    fontSize: 13,
    lineHeight: 22,
    color: '#989898'
  },
  listProjectsNo: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22
  },
  listItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 417,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderColor: '#E4E4E4',
      backgroundColor: 'white',
      paddingVertical: 20
  }
});

export default Settings;
