import React, { useEffect, useState, useRef } from "react";
import { View, SafeAreaView, ActivityIndicator, TouchableOpacity, StyleSheet, Image, Text, TextInput } from "react-native";
import TaskItem from "../tasks-page/task-item/task-item";
import ImagePicker from 'react-native-image-picker';
import {buttonColor, linkColor} from '../../assets/colors';

const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
};

const Profile = ({ navigation }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [avatarSource, setAvatarSource] = useState('./../../assets/profileImage2.png');

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
     
        setAvatarSource(source);
      }
    });
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
            <Image source={avatarSource} style={styles.avatarImage}/>
            <TouchableOpacity onPress={selectImageFromPicker}>
              <Text>Edit</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.personalView}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {/* <Image source={require('./../../assets/profileImage.png')}/> */}
                <View style={{ marginLeft: 20 }}>
                    <Text style={styles.nameText}>Luther Wilson</Text>
                    <Text style={styles.textInput}>something@gmail.com</Text>
                </View>
            </View>
            {/* <Image source={require('./../../assets/rightArrow.png')}/> */}
        </View>
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
  },
  avatarImage: {
    width: 200,
    height: 200
  }
});

export default Profile;
