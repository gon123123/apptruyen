import {
    View, Text, SafeAreaView, StyleSheet, Image,
    TouchableOpacity, ImageBackground, Dimensions,
    Modal, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import anh from '../../assets/image/thuatsi.jpg';
import { Ionicons } from '@expo/vector-icons';
const image = { uri: "https://img.freepik.com/free-vector/painted-background-multicoloured-palette_23-2148427592.jpg?w=2000" };

// thư vện chọn ảnh 
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// database connect 
import firebase, { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function Me({ navigation }) {
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
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [dataUser, setDataUser] = useState({});
    const [idUser, setIdUser] = useState('');
    function getDatabase() {
        // // get username 
        AsyncStorage.getItem("UserName")
            .then(result => setName(result));
        // get idUser
        AsyncStorage.getItem("idUser")
            .then(result => {
                setIdUser(result);
                let obj = {};
                firebase.database().ref('users/' + result).on('value', function (snapshot) {
                    obj = snapshot.val();
                    setDataUser(obj);
                    setPassword(obj.password.password);
                });
            });
    }
    // handle function update name , avatar , password ////////////////////////
    const [errorUpdate, setErrorUpdate] = useState({
        name: '* ',
        avatar: '* ',
        password: '* ',
        passwordCF: '*',
        passwordOld: '*',
    });
    //////////////////////////////////////////////////////////////////////////
    // handle update name 
    const [nameUpdate, setNameUpdate] = useState('');
    const [modalUpdateName, setModalUpdateName] = useState(false);
    function updateNameUser() {
        if (nameUpdate == '') {
            setErrorUpdate({
                name: 'cannot be left blank',
                avatar: '* ',
                password: '* ',
                passwordCF: '*',
                passwordOld: '*',
            })
        } else {
            AsyncStorage.setItem("UserName", nameUpdate);
            setModalUpdateName(false);
            getDatabase();
            firebase.database().ref('users/' + idUser + '/name').set({
                username: nameUpdate
            }, function (error) {
                if (error) {
                    alert('error ' + error);
                } else {
                    alert('success');
                    setNameUpdate('')
                    setErrorUpdate({
                        name: '* ',
                        avatar: '* ',
                        password: '* ',
                        passwordCF: '*',
                        passwordOld: '*',
                    })
                }
            });
        }
    }
    // handle update pass 
    const [passwordOld, setPasswordOld] = useState('');
    const [passUpdate, setPassUpdate] = useState('');
    const [passUpdateCF, setPassUpdateCF] = useState('');
    const [modalUpdatePass, setModalUpdatePass] = useState(false);
    function updatePass() {
        console.log(dataUser.password.password);
        // kiểm tra xem có đúng mk cũ chưa 
        let error = {
            name: '* ',
            avatar: '* ',
            password: '* ',
            passwordCF: '* ',
            passwordOld: '* ',
        };
        if (passwordOld == '' || passUpdate == '' || passUpdateCF == '') {
            if (passwordOld == '') {
                error.passwordOld = "* This field cannot be left blank ";
            }
            if (passUpdate == '') {
                error.password = "* This field cannot be left blank ";
            }
            if (passUpdateCF == '') {
                error.passwordCF = "* This field cannot be left blank ";
            }
            setErrorUpdate(error);
        } else {
            error.passwordOld = "* ";
            error.password = "* ";
            error.passwordCF = "* ";
            setErrorUpdate(error);
            if (passwordOld == password) {
                if (passUpdate == passUpdateCF) {
                    firebase.database().ref('users/' + idUser + '/password').set({
                        password: passUpdate
                    }, function (error) {
                        if (error) {
                            alert('error ' + error);
                        } else {
                            alert('success');
                            setPasswordOld("");
                            setPassUpdate("");
                            setPassUpdateCF("");
                        }
                    });
                } else {
                    error.passwordCF = "* password incorrect 😒";
                    setErrorUpdate(error);
                }
            } else {
                error.passwordOld = "* old password does not match 😒";
                setErrorUpdate(error);
            }
        }
    }
    // handle xử lý log out 
    const Logout = () => {
        AsyncStorage.removeItem("UserName");
        AsyncStorage.removeItem("UserPassword");
        navigation.navigate('Login');
    }
    // ẩn hiện modal thêm truyện mới 
    const [modalLightNovel, setModalLightNovel] = useState(false);
    // array  thể loại truyện
    const Category = ['Urban', 'Fiction', 'Myth', 'horror'];
    // gạch chân thể loại được chọn 
    const [typeMangaColor, setTypeMangaColor] = useState(['#FF8080', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']);
    const HandelPosTypeManga = (pos) => {
        switch (pos) {
            case 0:
                setTypeMangaColor(['#FF8080', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']);
                setSelectedCategory('Urban')
                break;
            case 1:
                setTypeMangaColor(['#FFFFFF', '#FF8080', '#FFFFFF', '#FFFFFF', '#FFFFFF']);
                setSelectedCategory('Fiction');
                break;
            case 2:
                setTypeMangaColor(['#FFFFFF', '#FFFFFF', '#FF8080', '#FFFFFF', '#FFFFFF']);
                setSelectedCategory('Myth');
                break;
            case 3:
                setTypeMangaColor(['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FF8080', '#FFFFFF']);
                setSelectedCategory('horror');
                break;
            default:
                setTypeMangaColor(['#FF8080', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']);
                setSelectedCategory('Urban');
                break;
        }
    }
    // create chapters 
    const [numberChapter, setNumberChapter] = useState(0);
    const [arrChapter, setArrChapters] = useState(null);
    const CreateChapter = (number) => {
        var date = new Date();
        var ngay = date.toISOString();
        var str = ((ngay.slice(0, 10).split('-')).reverse()).join('/');
        const array = [];
        for (let i = 0; i < number; i++) {
            array.push({
                chap: { chap: i + 1 },
                name: { name: '' },
                content: { content: '' },
                time: { time: str }
            })
        }
        setArrChapters([...array]);
        // console.log(array);
    }
    // cập nhật dữ liệu chap khi người dùng nhập 
    const UpdateNameChap = (position, name) => {
        // vị trí chap cần cập nhật
        const arrNew = arrChapter
        arrNew[position].name.name = name;
        setArrChapters(arrNew);
    }
    const UpdateContentChap = (position, content) => {
        // vị trí chap cần cập nhật
        const arrNew = arrChapter
        arrNew[position].content.content = content;
        setArrChapters(arrNew);
    }
    // kiểm ta dữ liệu trước khi thêm vào database
    const [nameStory, setNameStory] = useState('');
    const [descriptionStory, setDescriptionStory] = useState('');
    const [posterStory, setPosterStory] = useState('');
    const [bannerStory, setBannerStory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Urban');

    const ChooseImagePosterAsync = async () => {
        // cho phép truy cập thư viện ảnh
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
            return;
        }
        if (pickerResult.uri != '') {
            const base64 = await FileSystem.readAsStringAsync(pickerResult.uri, { encoding: 'base64' });
            setPosterStory(base64);
        }
    }
    const ChooseImageBannerAsync = async () => {
        // cho phép truy cập thư viện ảnh
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
            return;
        }
        if (pickerResult.uri != '') {
            const base64 = await FileSystem.readAsStringAsync(pickerResult.uri, { encoding: 'base64' });
            setBannerStory(base64);
        }
    }
    const CancelPost = () => {
        setNumberChapter(0);
        CreateChapter(0);
        setArrChapters(null);
        setNameStory('');
        setDescriptionStory('');
        setPosterStory('');
        setBannerStory('');
        HandelPosTypeManga(0)
    }
    const AlertWarning = (error) => {
        Alert.alert(
            "Warning",
            error);
    }
    const ValidateFrom = () => {
        if (nameStory == '' || descriptionStory == '' || numberChapter == 0 || posterStory == '' || bannerStory == '') {
            if (nameStory == '') {
                AlertWarning('Name cannot be left blank');
                return;
            }
            if (descriptionStory == '') {
                AlertWarning('Description cannot be left blank');
                return;
            }
            if (posterStory == '') {
                AlertWarning('Poster cannot be left blank');
                return;
            }
            if (bannerStory == '') {
                AlertWarning('Banner cannot be left blank');
                return;
            }
            if (numberChapter == 0) {
                AlertWarning('Number of Chapters cannot be left blank');
                return;
            }
        }
        if (numberChapter > 0) {
            let leng = arrChapter.length;
            for (let i = 0; i < leng; i++) {
                if (arrChapter[i].name.name == '' || arrChapter[i].content.content == '') {
                    if (arrChapter[i].name.name == '') {
                        AlertWarning('Chapter ' + (i + 1) + ' : Name cannot be left blank');
                        return;
                    }
                    if (arrChapter[i].content.content == '') {
                        AlertWarning('Chapter ' + (i + 1) + ' : Content cannot be left blank');
                        return;
                    }
                }
            }
            // kiểm tra hoàn tất 
            addLightNovel();
        }
    }
    const addLightNovel = () => {
        var date = new Date();
        var ngay = date.toISOString();
        var str = ((ngay.slice(0, 10).split('-')).reverse()).join('/');

        let name = { name: nameStory };
        let description = { description: descriptionStory };
        let image = {
            poster: posterStory,
            banner: bannerStory
        };
        let chapter = { chapter: numberChapter };
        let type = { type: selectedCategory };
        let data = { data: arrChapter };
        let view = { view: 0 };
        let favorite = { favorite: 0 };
        let time = { time: str };
        let newManga = { new: true };
        firebase.database().ref('LightNovel/').push().set({
            name: name,
            description: description,
            image: image,
            chapter: chapter,
            type: type,
            data: data,
            view: view,
            favorite: favorite,
            time: time,
            newManga: newManga,
        }, function (error) {
            if (error) {
                alert('error ' + error);
            } else {
                alert('success');
            }
        });
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container2}>
                <ImageBackground source={image} style={styles.background} >
                    <View style={styles.info}>
                        <Image source={anh} style={styles.image} />
                        <Text style={styles.name}>{name}</Text>
                        {/* <Text style={styles.time}>12:30</Text> */}
                    </View>
                </ImageBackground>
                <TouchableOpacity onPress={() => setModalUpdateName(true)}>
                    <View style={styles.option}>
                        <Ionicons name='pencil' style={styles.icon} />
                        <Text style={styles.nameOption}>Update name</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={styles.option}>
                        <Ionicons name='image-outline' style={styles.icon} />
                        <Text style={styles.nameOption}>Change avatar</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalUpdatePass(true)}>
                    <View style={styles.option}>
                        <Ionicons name='lock-closed' style={styles.icon} />
                        <Text style={styles.nameOption}>Change Password</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Logout()}>
                    <View style={styles.option}>
                        <Ionicons name='ios-log-out' style={styles.icon} />
                        <Text style={styles.nameOption}>Log out</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.boxOptionBig}>
                    <TouchableOpacity onPress={() => setModalLightNovel(true)}>
                        <Text style={styles.textButton}>Upload LightNovel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.textButton}>Upload Manga</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType="slide"
                    // transparent={true}
                    visible={modalLightNovel}
                >
                    {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} > */}
                    <View style={styles.boxModal} onPress={Keyboard.dismiss}>
                        <View style={styles.boxModal_header}>
                            <TouchableOpacity onPress={() => { CancelPost(), setModalLightNovel(!modalLightNovel) }}>
                                <Text style={styles.textModalCancel}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.boxModal_body}>
                                <View style={styles.groupInput}>
                                    <Text style={styles.nameManga}>Name lightNovel</Text>
                                    <TextInput style={styles.textInput}
                                        autoCapitalize="words"
                                        placeholder="enter name lightNovel"
                                        onChangeText={(text) => setNameStory(text)}
                                    />
                                </View>
                                <View style={styles.groupInput}>
                                    <Text style={styles.nameManga}>Description</Text>
                                    <TextInput style={styles.textInput}
                                        multiline={true}
                                        placeholder="enter description lightNovel"
                                        onChangeText={(text) => setDescriptionStory(text)}
                                    />
                                </View>
                                <Text style={styles.nameManga}>Poster</Text>
                                <View style={styles.chose}>
                                    <View style={styles.groupButton}>
                                        <TouchableOpacity onPress={() => ChooseImagePosterAsync()}>
                                            <Text style={styles.buttonChoose}>Choose Image</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setPosterStory('')}>
                                            <Text style={styles.buttonChoose}>Clear</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.boxImage}>
                                        <View style={styles.image_border}>
                                            {posterStory == ''
                                                ? <TouchableOpacity onPress={() => ChooseImagePosterAsync()}>
                                                    <Ionicons name="add-outline" style={styles.iconChoose} />
                                                </TouchableOpacity>
                                                : <Image source={{ uri: 'data:image/jpeg;base64,' + posterStory }} style={styles.imageChoose} />
                                            }
                                        </View>
                                    </View>
                                </View>
                                <Text style={styles.nameManga}>Banner</Text>
                                <View style={styles.chose}>
                                    <View style={styles.groupButton}>
                                        <TouchableOpacity onPress={() => ChooseImageBannerAsync()}>
                                            <Text style={styles.buttonChoose}>Choose Image</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setBannerStory('')}>
                                            <Text style={styles.buttonChoose}>Clear</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.boxImage}>
                                        <View style={styles.image_border2}>
                                            {bannerStory == ''
                                                ? <TouchableOpacity onPress={() => ChooseImageBannerAsync()}>
                                                    <Ionicons name="add-outline" style={styles.iconChoose} />
                                                </TouchableOpacity>
                                                : <Image source={{ uri: 'data:image/jpeg;base64,' + bannerStory }} style={styles.imageChoose2} />
                                            }
                                        </View>
                                    </View>
                                </View>
                                <Text style={styles.nameManga}>Category</Text>
                                <View style={styles.selectGroup}>
                                    {Category.map((item, index) => {
                                        return <TouchableOpacity key={index} onPress={() => HandelPosTypeManga(index)}>
                                            <View style={[styles.box_item, { borderBottomColor: typeMangaColor[index] }]}>
                                                <Text style={styles.CategoryName}>{item}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    })}
                                </View>
                                <View style={styles.groupInput}>
                                    <Text style={styles.nameManga}>Number Of Chapters</Text>
                                    <TextInput style={styles.textInput}
                                        keyboardType="numeric"
                                        placeholder="enter description lightNovel"
                                        onChangeText={(text) => {
                                            CreateChapter(Number(text)),
                                                setNumberChapter(Number(text))
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.hr}></View>
                            {arrChapter != null
                                ? arrChapter.map((item, index) => {
                                    return <View key={index}>
                                        <Text style={styles.nameChapter}>Chapter {item.chap.chap}</Text>
                                        <View style={styles.groupInput}>
                                            <Text style={styles.nameManga}>Name Chapter</Text>
                                            <TextInput style={styles.textInput}
                                                autoCapitalize="words"
                                                placeholder="enter name chapter"
                                                onChangeText={(text) => UpdateNameChap(index, text)}
                                            />
                                        </View>
                                        <View style={styles.groupInput}>
                                            <Text style={styles.nameManga}>Content</Text>
                                            <TextInput style={styles.textInput}
                                                multiline={true}
                                                placeholder="enter Content"
                                                onChangeText={(text) => UpdateContentChap(index, text)}
                                            />
                                        </View>
                                    </View>
                                })
                                : <Text></Text>
                            }
                            <View style={styles.buttonPost}>
                                <TouchableOpacity onPress={() => ValidateFrom()}>
                                    <Text style={styles.textButton_post}>Post</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>
                {/* modal update name */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalUpdateName}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.boxUpdate}>
                            <View style={styles.box_Update}>
                                <Text style={styles.title_box_Update}>New Name</Text>
                                <TextInput placeholder="Enter new name" style={styles.text_box_Update}
                                    value={nameUpdate}
                                    onChangeText={(text) => setNameUpdate(text.trim())}
                                />
                                <Text style={styles.text_Update_Error}>{errorUpdate.name}</Text>
                                <View style={styles.button_box_Update}>
                                    <TouchableOpacity style={styles.buttonTouch} onPress={() => updateNameUser()}>
                                        <Text style={styles.text_button}>OK</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonTouch} onPress={() => setModalUpdateName(false)}>
                                        <Text style={styles.text_button}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {/* modal update pass */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalUpdatePass}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.boxUpdate}>
                            <View style={styles.box_Update}>
                                <Text style={styles.title_box_Update}>Old password</Text>
                                <TextInput placeholder="enter old password " style={styles.text_box_Update}
                                    value={passwordOld}
                                    onChangeText={(text) => setPasswordOld(text)}
                                />
                                <Text style={styles.text_Update_Error}>{errorUpdate.passwordOld}</Text>
                                <Text style={styles.title_box_Update}>New password</Text>
                                <TextInput placeholder="enter new password " style={styles.text_box_Update}
                                    value={passUpdate}
                                    onChangeText={(text) => setPassUpdate(text)}
                                />
                                <Text style={styles.text_Update_Error}>{errorUpdate.password}</Text>
                                <Text style={styles.title_box_Update}>Confirm password</Text>
                                <TextInput placeholder="confirm password" style={styles.text_box_Update}
                                    value={passUpdateCF}
                                    onChangeText={(text) => setPassUpdateCF(text)}
                                />
                                <Text style={styles.text_Update_Error}>{errorUpdate.passwordCF}</Text>
                                <View style={styles.button_box_Update}>
                                    <TouchableOpacity style={styles.buttonTouch} onPress={() => updatePass()}>
                                        <Text style={styles.text_button}>OK</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonTouch} onPress={() => setModalUpdatePass(false)}>
                                        <Text style={styles.text_button}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingLeft: 10,
        paddingRight: 10,
        ...Platform.select({
            android: {
                paddingTop: 23.5,
            }
        })
    },
    container2: {
        ...Platform.select({
            ios: {
                paddingLeft: 10,
            }
        }),
    },
    info: {
        flexDirection: "row",
        paddingTop: 10,
        paddingBottom: 30,
        height: windowHeight / 4,
        alignItems: "flex-end"
    },
    background: {
        height: windowHeight / 4,
        width: windowWidth - 20,
        marginBottom: 15,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        ...Platform.select({
            android: {
                width: 70,
                height: 70,
                borderRadius: 70 / 2,
            }
        }),
        marginRight: 8,
        marginLeft: 8,
    },
    name: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 10,
        ...Platform.select({
            ios: {
                fontSize: 14,
            }
        }),
        color: '#FFFFFF'
    },
    // option 
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'red',
        paddingTop: 8,
        paddingBottom: 8,
    },
    icon: {
        fontSize: 17,
        marginRight: 5,
        color: "#FF8080",
    },
    nameOption: {
        fontSize: 13,
        fontWeight: '500',
    },
    // upload 
    boxOptionBig: {
        // width: windowWidth,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    textButton: {
        backgroundColor: '#F8F4F5',
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 20,
        paddingLeft: 20,
        borderRadius: 7,
        fontWeight: '500',
        color: '#FF8080'
    },
    // upload modal boxModal
    boxModal: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
        ...Platform.select({
            ios: {
                paddingTop: 30
            }
        })
    },
    boxModal_header: {
        width: '100%',
        alignItems: 'flex-end',
    },
    textModalCancel: {
        fontWeight: '500',
        color: '#FF8080',
    },
    nameManga: {
        fontWeight: '500',
        color: '#999C9E',
        marginBottom: 5,
        marginTop: 5
    },
    textInput: {
        borderWidth: 0.5,
        borderColor: '#FF8080',
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 7,
        marginBottom: 10,
    },
    chose: {
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: '#FF8080'
    },
    groupButton: {
        justifyContent: 'space-evenly',
    },
    buttonChoose: {
        backgroundColor: '#F8F4F5',
        fontWeight: '500',
        color: '#FF8080',
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 5,
        paddingRight: 5,
        margin: 5,
        alignSelf: 'flex-start',
        borderRadius: 5,
    },
    boxImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        marginBottom: 5,
    },
    image_border: { // poster
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#FF8080',
        width: windowWidth / 2.8,
        height: windowHeight / 3.5,
        ...Platform.select({
            android: {
                width: windowWidth / 3.3,
            }
        }),
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconChoose: {
        fontSize: 35,
        color: '#FF8080'
    },
    imageChoose: { // poster
        width: windowWidth / 2.8,
        height: windowHeight / 3.5,
        borderRadius: 5,
        marginBottom: 3,
        ...Platform.select({
            android: {
                width: windowWidth / 3.3,
            }
        })
    },
    //     
    image_border2: {  // banner
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#FF8080',
        justifyContent: 'center',
        alignItems: 'center',
        width: windowWidth / 2.1,
        height: windowHeight / 5,
        ...Platform.select({
            ios: {
                width: windowWidth / 2.2,
                height: windowHeight / 5.5
            }
        })
    },
    imageChoose2: { // banner
        width: windowWidth / 2.1,
        height: windowHeight / 5,
        borderRadius: 5,
        marginBottom: 5,
        ...Platform.select({
            ios: {
                width: windowWidth / 2.2,
                height: windowHeight / 5.5
            }
        })
    },
    // Category
    selectGroup: {
        padding: 10,
        paddingTop: 0,
        ...Platform.select({
            ios: {
                paddingTop: 10,
            }
        }),
        paddingBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },
    box_item: {
        width: windowWidth / 3.4,
        ...Platform.select({
            ios: {
                width: windowWidth / 3.4,
            }
        }),
        backgroundColor: '#F8F8F8',
        paddingTop: 5,
        paddingBottom: 5,
        marginBottom: 10,
        marginRight: 5,
        borderRadius: 5,
        borderBottomWidth: 2,
    },
    CategoryName: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
        alignSelf: 'center',
        color: '#525354'
    },
    // thanh ngang (phân đoạn)
    hr: {
        width: '100%',
        height: 8,
        backgroundColor: '#F8F4F5',
        marginTop: 20,
    },
    // chapters
    nameChapter: {
        fontWeight: '500',
        marginBottom: 5,
        marginTop: 5
    },
    // button post
    buttonPost: {
        paddingTop: 30,
        paddingBottom: 30,
        ...Platform.select({
            ios: {
                paddingTop: 10,
            }
        }),
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    textButton_post: {
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        backgroundColor: "#FF8080",
        color: "#FFFFFF",
        fontWeight: '500'
    },
    // modal update name 
    boxUpdate: {
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth,
        height: windowHeight,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    box_Update: {
        width: windowWidth / 1.5,
        backgroundColor: '#FFFFFF',
        padding: 10,
        paddingTop: 7,
        paddingBottom: 7,
        borderRadius: 5,
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 2 },
        shadowOpacity: 0.2,
    },
    title_box_Update: {
        fontSize: 13,
        paddingBottom: 6,
        color: '#525354'
    },
    text_box_Update: {
        borderWidth: 0.5,
        borderColor: '#FF8080',
        borderRadius: 5,
        padding: 3,
        paddingLeft: 7,
        marginBottom: 2,
    },
    text_Update_Error: {
        marginBottom: 5,
        fontSize: 12,
        fontStyle: 'italic',
        color: 'red'
    },
    button_box_Update: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 7,
    },
    buttonTouch: {
        backgroundColor: '#FF8080',
        padding: 2,
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 5,
        width: 90,
    },
    text_button: {
        color: '#FFFFFF',
        fontWeight: '500',
        textAlign: 'center',
    }
});