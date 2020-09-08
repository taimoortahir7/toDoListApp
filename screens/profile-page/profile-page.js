import React, { useEffect, useState, useRef } from "react";
import { View, SafeAreaView, ActivityIndicator, TouchableOpacity, StyleSheet, Image, Alert, Text, TextInput } from "react-native";
import TaskItem from "../tasks-page/task-item/task-item";
import ImagePicker from 'react-native-image-picker';
import {buttonColor, linkColor} from '../../assets/colors';
import { auth, database } from './../../utils/firebase-config';
import storage from '@react-native-firebase/storage';
import { useSelector } from "react-redux";

const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
};

const Profile = ({ route, navigation }) => {

  const { username, email, password, image } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [avatarSource, setAvatarSource] = useState(image ? image : require('./../../assets/profileImage2.png'));

  const userID = useSelector((state) => state.auth.userId);

  useEffect(() => {
    var user = auth.onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        console.log('signed in: ', user);
      } else {
        console.log('not signed in: ', user);
        // No user is signed in.
      }
    });
  }, []);

  const selectImageFromPicker = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
     
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
     
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        uploadImage(source);

      }
    });
  };

  const uploadImage = (source) => {
    const { uri } = source;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    console.log('filename', filename);

    const task = storage()
    .ref(filename)
    .putFile(uploadUri);
    // set progress state
    task.on('state_changed', snapshot => {
      // setTransferred(
      //   Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
      // );
    }, function(error) {
      // Handle unsuccessful uploads
      console.log('error: ', error);
    }, function() {
      task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
        setAvatarSource(downloadURL);

        updateDBRef();

      });
    });
  };

  const updateDBRef = () => {
    database.ref('/users/' + userID).set({
      username: username,
      email: email,
      password: password,
      image: avatarSource
    });
  };

  const deleteAccount = () => {

    // console.log('auth: ', auth);
    // console.log('auth user: ', auth.currentUser);

    // user.delete().then(function() {
    //   Alert.alert("User deleted successfully!", [{ text: "Okay" }]);
    //   console.log('user deleted successfully!');
    //   navigation.navigate('/Signin');
    // }, function(error) {
    //   console.log('error deleting user!');
    // });
  };

//   const tasks = useSelector((state) => state.tasks.availableTasks);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     setIsLoading(true);
//     dispatch(tasksActions.fetchTasks(projectID)).then(() => {
//       setIsLoading(false);
//     });
//   }, [dispatch]);

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
            <TouchableOpacity onPress={selectImageFromPicker} style={{ alignItems: 'center' }}>
              <Image source={avatarSource} style={styles.avatarImage}/>
              <Text>Edit</Text>
            </TouchableOpacity>
        </View>
        <Text style={styles.textInput}>FULL NAME</Text>
        <View style={styles.personalView}>
            <View style={{ alignItems: 'center' }}>
                <View style={{ marginLeft: 10 }}>
                <Text style={styles.nameText}>{username}</Text>
                </View>
            </View>
        </View>
        <Text style={styles.textInput}>EMAIL</Text>
        <View style={styles.personalView}>
            <View style={{ alignItems: 'center' }}>
                <View style={{ marginLeft: 10 }}>
                <Text style={styles.nameText}>{email}</Text>
                </View>
            </View>
        </View>
        <Text style={styles.textInput}>PASSWORD</Text>
        <View style={styles.personalView}>
            <View style={{ alignItems: 'center' }}>
                <View style={{ marginLeft: 10 }}>
                <TextInput secureTextEntry={true} editable={false} style={styles.nameText}>{password}</TextInput>
                </View>
            </View>
        </View>

        <View style={{ backgroundColor: 'white', paddingVertical: 20, paddingHorizontal: 20, marginTop: 50}}>
            <View style={{ alignItems: 'center' }}>
                <View style={{ marginLeft: 10 }}>
                  <TouchableOpacity onPress={deleteAccount}>
                    <Text style={styles.nameText, {color: '#EA4335'}}>Delete Account</Text>
                  </TouchableOpacity>
                </View>
            </View>
        </View>

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
        // borderBottomWidth: 1,
        // borderColor: '#E4E4E4',
        paddingVertical: 50,
        width: '100%',
        alignItems: 'center',
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
    color: '#989898',
    marginHorizontal: 30
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
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 200
  }
});

export default Profile;
