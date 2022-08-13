import {
    View, Text, TouchableOpacity,
    SafeAreaView, TextInput, StyleSheet,
    TouchableWithoutFeedback, Keyboard, Dimensions, Image
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import facebook from '../assets/image/facebook.png';
import google from '../assets/image/google.png';
import twitter from '../assets/image/twitter.jpg';

import firebase, { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function Login({ navigation }) {
    const [data, setData] = useState(null);
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({
        name: '* ',
        pass: '* '
    })
    const [checkRemember, setCheckRemember] = useState(true);
    const nextStep = useRef(false);
    useEffect(() => {
        const firebaseConfig = {
            apiKey: "AIzaSyCD2uR37LeHRGQpUcQdt1Cx661AcG1b3Jk",
            authDomain: "apptruyen-6d8a6.firebaseapp.com",
            projectId: "apptruyen-6d8a6",
            storageBucket: "apptruyen-6d8a6.appspot.com",
            messagingSenderId: "303737362308",
            appId: "1:303737362308:web:347d3c2ef9330f9c6bafd1",
            measurementId: "G-P11TH3DT9G"
        };
        // firebase.initializeApp(firebaseConfig);
        if (!firebase.apps.length) {
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            // const analytics = getAnalytics(app);
            console.log('ket noi thanh cong');
        }
        getDatabase();
    }, []);
    function getDatabase() {
        firebase.database().ref('users/').on('value', function (snapshot) {
            let array = [];
            snapshot.forEach(function (item) {
                var childData = item.val();
                array.push({
                    id: item.key,
                    name: childData.name.username,
                    password: childData.password.password,
                    status: childData.status,
                    avatar: childData.avatar,
                });
            });
            setData(array);
            // // get username 
            AsyncStorage.getItem("UserName")
                .then(result => setUserName(result));
            // get password
            AsyncStorage.getItem("UserPassword")
                .then(result => { setPassword(result), result != null ? navigation.navigate('BottomTab') : "" });
        });
    }
    // xử lý tạm phần đăng nhập
    const handleRememberPass = () => {
        AsyncStorage.setItem("UserName", username);
        AsyncStorage.setItem("UserPassword", password);
    }
    const handleDeleteRememberPass = () => {
        AsyncStorage.removeItem("UserName");
        AsyncStorage.removeItem("UserPassword");
    }
    function handleLogin() {
        var error = {
            name: '* ',
            pass: '* ',
        }
        if (username == "" || password == "") {
            if (username == "") {
                error.name = "* This field cannot be left blank";
            }
            if (password == "") {
                error.pass = "* This field cannot be left blank";
            }
            setError(error);
        } else {
            let check = false; // kiểm tra tài khoản tồn tại
            for (const value of data) {
                if (value.name == username && value.password == password) {
                    check = true;
                    // get password
                    AsyncStorage.setItem("idUser", value.id);
                    break;
                }
            }
            if (check) {
                if (checkRemember) {
                    console.log('true')
                    nextStep.current = true;
                    handleRememberPass();
                } else {
                    console.log('false')
                    nextStep.current = false;
                    handleDeleteRememberPass();
                }
                setUserName("");
                setPassword("");
                navigation.navigate('BottomTab');
            } else {
                error.name = "* The account does not exist or entered the wrong password";
                setError(error);
            }
        }
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <SafeAreaView style={styles.container}>
                <View style={styles.box}>
                    <Text style={styles.box_title}>SIGN IN</Text>
                    <View style={styles.box_form}>
                        <Text style={styles.box_form_label}>USERNAME</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="md-person" size={20} style={{ marginBottom: 5, marginRight: 10, color: '#999C9E' }} />
                            <TextInput style={styles.box_form_input} placeholder="Enter your name"
                            value={username}
                                onChangeText={(text) => setUserName(text)}
                            />
                        </View>
                        <Text style={styles.text_error}>{error.name}</Text>
                        <Text style={styles.box_form_label}>PASSWORD</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="lock-closed" size={20} style={{ marginBottom: 5, marginRight: 10, color: '#999C9E' }} />
                            <TextInput style={styles.box_form_input} placeholder="Enter your pass"
                            value={password}
                                onChangeText={(text) => setPassword(text)}
                            />
                        </View>
                        <Text style={styles.text_error}>{error.pass}</Text>
                        <View style={styles.boxCheck}>
                            <TouchableOpacity onPress={() => setCheckRemember(!checkRemember)}>
                                {checkRemember
                                    ? <Ionicons name="ios-checkbox-outline" style={styles.checkIcon} />
                                    : <View style={styles.check}></View>
                                }
                            </TouchableOpacity>
                            <Text style={styles.form_textForget}>remember password</Text>
                        </View>
                        <View style={styles.button}>
                            <TouchableOpacity onPress={handleLogin}>
                                <Text style={styles.textButton}>CONTINUE</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.other}>
                            <View style={styles.otherStrike}></View>
                            <Text style={styles.otherText}>SIGN UP WITH</Text>
                            <View style={styles.otherStrike}></View>
                        </View>
                        <View style={styles.boxIcon}>
                            <TouchableOpacity>
                                <Image source={facebook} style={styles.boxIcon_image} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={twitter} style={styles.boxIcon_image} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={google} style={styles.boxIcon_image} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.noteNavigation}>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ flexDirection: 'row' }}>
                            <Text style={styles.noteNavigationText}>Don't have an account ? </Text><Text style={[styles.noteNavigationText, { fontWeight: '500' }]}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: 'white',
    },
    box: {
        padding: '10%',
        flex: 1,
    },
    box_title: {
        fontSize: 30,
        color: '#999C9E',
        letterSpacing: 2,
    },
    box_form: {
        flex: 1,
        justifyContent: 'center'
    },
    box_form_label: {
        fontSize: 13,
        color: '#999C9E',
        paddingBottom: 6.5,
        fontWeight: '500',
    },
    box_form_input: {
        borderBottomWidth: 0.8,
        borderColor: '#FF8080',
        paddingTop: 8,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 5,
        marginBottom: 5,
        width: '90%',
    },
    text_error: {
        marginBottom: 20,
        fontStyle: 'italic',
        color: 'red',
        fontSize: 12,
    },
    // check remember password
    boxCheck: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    check: {
        width: 14,
        height: 14,
        borderWidth: 0.5,
        borderColor: "#525354",
        marginRight: 7,
    },
    checkIcon: {
        alignItems: 'center',
        alignSelf: 'center',
        fontSize: 17,
        fontWeight: 'bold',
        color: "#FF8080",
        marginRight: 7,
    },
    form_textForget: {
        // textAlign: 'center',
        // marginTop: 5,
        color: '#999C9E',
    },
    button: {
        alignItems: 'center',
        marginTop: 20,
        // width: windowWidth / 2,
    },
    textButton: {
        backgroundColor: '#FF8080',
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 10,
        paddingLeft: 10,
        width: windowWidth / 2,
        textAlign: 'center',
        color: '#FFFFFF',
        letterSpacing: 2,
        borderRadius: 5,
    },
    other: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 25,
        justifyContent: 'center'
    },
    otherStrike: {
        width: windowWidth / 5,
        height: 1,
        backgroundColor: '#999C9E',
    },
    otherText: {
        color: '#999C9E',
        fontSize: 8,
        marginLeft: 5,
        marginRight: 5,
    },
    boxIcon: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 50,
    },
    boxIcon_image: {
        width: 55,
        height: 55,
        borderRadius: 55 / 2,
        backgroundColor: '#FFFFFF',
    },
    noteNavigation: {
        flexDirection: 'row',
    },
    noteNavigationText: {
        color: '#999C9E',
    }
})