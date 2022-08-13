import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Image, Dimensions, ImageBackground, ScrollView, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as SQLite from 'expo-sqlite';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const image = { uri: "https://img.freepik.com/free-vector/painted-background-multicoloured-palette_23-2148427592.jpg?w=2000" };
// connect database
import firebase, { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
// import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

export default function Description({ route, navigation }) {
    const { item, home } = route.params;
    const data = item;
    const optionDownload = home; // nếu bằng true thì hiện (download rồi thì không hiện)
    const arrayData = data.data;
    const [option, setOption] = useState(['#FF8080', '#FFFFFF']);
    const [contentOption, setContentOption] = useState(false);
    const HandleOption = (pos) => {
        switch (pos) {
            case 0:
                setOption(['#FF8080', '#FFFFFF']);
                setContentOption(false);
                break;
            case 1:
                setOption(['#FFFFFF', '#FF8080']);
                setContentOption(true);
                break;
            default:
                setOption(['#FF8080', '#FFFFFF']);
                setContentOption(false);
                break;
        }
    }
    function openDatabase() {
        const db = SQLite.openDatabase("db.db");
        return db;
    }
    const db = openDatabase();
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
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS  storyDownload (id INTEGER PRIMARY KEY AUTOINCREMENT, key VARCHAR(50), name TEXT, description TEXT, poster TEXT, banner TEXT, chapter TEXT, type TEXT, data TEXT, view TEXT, favorite TEXT)",
                [],
                (sqlTxn, res) => {
                    console.log('table create success');
                },
                (error) => {
                    console.log('error creating table ' + error.message);
                }
            );
        });
    }, []);
    const DownloadStory = () => {
        console.log('da download')
        const dataStory = JSON.stringify(data.data); // chuyển sang dạng json để lưu mảng data
        db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO storyDownload (key, name, description, poster, banner, chapter, type, data, view, favorite) VALUES (?,?,?,?,?,?,?,?,?,?)`,
                [data.id, data.name, data.description, data.poster, data.banner, data.chapter, data.type, dataStory, data.view, data.favorite],
                (sqlTxn, res) => {
                    Alert.alert('Success', 'Download success');
                },
                (error) => {
                    console.log('error on adding storyDownload ' + error.message);
                }
            );
        })
    }
    const CheckStoryKey = () => {  // kiểm tra xem có trùng lạp truyện không để tải
        // db.transaction(tx => {
        //     tx.executeSql('DROP TABLE storyDownload', [], (sqlTxn, res) => { console.log('table delete success'); });
        // })
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT key FROM storyDownload ORDER BY id DESC`,
                [],
                (sqlTxn, res) => {
                    let len = res.rows.length;
                    // res.rows // return webSQLROWS
                    // res.rows.item(0) // lấy từng đối tượng ra 
                    console.log(len);
                    if (len > 0) {
                        let result = [];
                        for (let i = 0; i < len; i++) {
                            let item = res.rows.item(i);
                            result.push(item.key);
                        }
                        // console.log(result);
                        const kt = result.every((item) => {
                            return item != data.id;
                        })
                        if (kt) { // nếu chưa có trong danh sách tải xuống
                            DownloadStory() // tải xuống
                        } else {
                            Alert.alert('Warning', 'already in the download list');
                        }
                    } else {
                        // danh sách đang trống
                        DownloadStory() // tải xuống
                    }
                },
                (error) => {
                    console.log('error on adding storyDownload ' + error.message);
                }
            );
        })
    }
    const [favoriteQlt1,setFavoriteQlt1] = useState(''); 
    const favoriteQlt = useRef(0)
    function handleFavorite(favorite) {
        console.log(favorite);
        if(favoriteQlt.current == 0){
            favoriteQlt.current = favorite + 1;
            setFavoriteQlt1(favoriteQlt.current);
        }else{
            favoriteQlt.current = favoriteQlt.current + 1;
            setFavoriteQlt1(favoriteQlt.current);
        }
        console.log(favoriteQlt.current);
        console.log(item.id);
        firebase.database().ref('LightNovel/' + item.id + '/favorite').set({
            favorite: favoriteQlt.current
        });
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ImageBackground blurRadius={3} source={{ uri: 'data:image/jpeg;base64,' + data.banner }}>
                    <View style={styles.child}>
                        <View style={styles.headerBanner}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Ionicons style={styles.iconHeader} name="chevron-back-outline" />
                            </TouchableOpacity>
                            {optionDownload
                                ? <View style={{ flexDirection: 'row', width: 60, justifyContent: 'space-between' }}>
                                    <TouchableOpacity onPress={() => CheckStoryKey()}>
                                        <Ionicons style={styles.iconHeader} name="download-outline" />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Ionicons style={styles.iconHeader} name="ellipsis-horizontal" />
                                    </TouchableOpacity>
                                </View>
                                : <Text></Text>
                            }
                        </View>
                        <View style={styles.descriptionStory}>
                            <Image source={{ uri: 'data:image/jpeg;base64,' + data.poster }} style={styles.imageDestination} />
                            <View style={styles.textDescription}>
                                <Text style={styles.textNameDescription}>{data.name}</Text>
                                <Text style={styles.textTypeDescription}>{data.type}</Text>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>
            <View style={styles.tabBar}>
                <TouchableOpacity onPress={() => HandleOption(0)}>
                    <Text style={[styles.textButton, { borderBottomColor: option[0] }]}>Detail</Text>
                </TouchableOpacity>
                <Text>|</Text>
                <TouchableOpacity onPress={() => HandleOption(1)}>
                    <Text style={[styles.textButton, { borderBottomColor: option[1] }]}>Chapter</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {contentOption == false
                        ? <>
                            <Text style={styles.title}>View : {data.view}</Text>
                            <View style={styles.evaluate}>
                                <Text style={styles.title}>Favorite : {favoriteQlt.current == 0 ? data.favorite : favoriteQlt1}</Text>
                                <TouchableOpacity onPress={() => handleFavorite(data.favorite)}>
                                    <View style={styles.favorite_button}>
                                        <Text style={styles.text_favorite}>favorite</Text>
                                        <Ionicons name="heart" style={styles.heart_favorite} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.title}>Description : </Text>
                            <Text>{data.description}</Text>
                        </>
                        : arrayData.map((item, index) => {
                            return <TouchableOpacity key={index} onPress={() => navigation.navigate('read', {
                                pos: item.chap.chap,
                                data: arrayData
                            })}>
                                <View style={styles.boxChapter}>
                                    <View style={styles.boxName}>
                                        <Text style={styles.boxName_text}>Chapter : {item.chap.chap}</Text>
                                        <Text style={styles.boxName_text}>{item.name.name}</Text>
                                    </View>
                                    <Text style={styles.time_text}>{item.time.time}</Text>
                                </View>
                            </TouchableOpacity>
                        })
                    }
                </ScrollView>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: "#FFFFFF",
    },
    headerBanner: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
    },
    child: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingBottom: 20,
    },
    iconHeader: {
        fontSize: 25,
        color: "#FFFFFF",
    },
    descriptionStory: {
        flexDirection: "row",
        marginTop: 65,
    },
    imageDestination: {
        width: windowWidth / 4,
        height: windowHeight / 4.5,
        marginRight: 15,
        marginLeft: 10,
        borderRadius: 7,
    },
    textDescription: {
        alignItems: "flex-start",
    },
    textNameDescription: {
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 10
    },
    textTypeDescription: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 5,
        paddingLeft: 5,
        paddingRight: 5,
        color: '#999C9E',
    },
    // tabBar
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 15,
    },
    textButton: {
        fontWeight: '500',
        color: '#525354',
        paddingTop: 5,
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 7,
        borderBottomWidth: 3,
    },
    title: {
        color: '#525354',
    },
    // evaluate
    evaluate: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    favorite_button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF8080',
        padding: 3,
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 5,
    },
    text_favorite: {
        marginRight: 5,
        color: '#FFFFFF',
        lineHeight: 16,
    },
    heart_favorite: {
        color: '#FFFFFF',
    },
    // content 
    content: {
        flex: 1,
        marginTop: 15,
        // paddingBottom: 100,
        paddingLeft: 7,
        paddingRight: 7,
    },
    boxButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconFavorite: {
        marginRight: 10,
        color: '#FF8080',
    },
    boxChapter: {
        marginBottom: 5,
        paddingBottom: 5,
        borderBottomWidth: 0.3,
        borderBottomColor: 'gray',
    },
    boxName: {
        flexDirection: 'row',
        padding: 5,
    },
    boxName_text: {
        marginRight: 5,
    },
    time_text: {
        paddingLeft: 5,
        fontSize: 12,
        color: '#525354'
    }
})