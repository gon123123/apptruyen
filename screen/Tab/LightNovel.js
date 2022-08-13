import {
    View, Text, SafeAreaView, StyleSheet, TextInput,
    TouchableWithoutFeedback, Keyboard, TouchableOpacity,
    Image, Dimensions, ScrollView, RefreshControl
} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'

// box lightNovel 
import BoxLightNovel from '../../components/BoxLightNovel';
// connect database
import firebase, { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
// import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function LightNovel({ navigation }) {
    const positionCurrent = useRef(0);
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
            getDatabase();
        }
        getDatabase();
    }, []);
    const [allData, setAllData] = useState(null);
    const [data, setData] = useState(null);
    const [urbanList, setUrbanList] = useState(null);
    const [fictionList, setFictionList] = useState(null);
    const [mythList, setMythList] = useState(null);
    const [horrorList, setHorrorList] = useState(null);

    const getDatabase = () => {
        firebase.database().ref('LightNovel/').on('value', function (snapshot) {
            let array = [];
            snapshot.forEach(function (item) {
                var childData = item.val();
                array.push({
                    id: item.key,
                    name: childData.name.name,
                    description: childData.description.description,
                    chapter: childData.chapter.chapter,
                    favorite: childData.favorite.favorite,
                    newManga: childData.newManga.new,
                    time: childData.time.time,
                    view: childData.view.view,
                    type: childData.type.type,
                    data: childData.data.data,
                    poster: childData.image.poster,
                    banner: childData.image.banner,
                });
            });
            setData(array);
            // console.log(array);
            setAllData(array); // chứa mọi thể loại truyện 
            // tạo các mảng để chứa từng loại truyện 
            var urban = [];
            var fiction = [];
            var myth = [];
            var horror = [];
            array.forEach((item) => {
                if (item.type == 'Urban') {
                    console.log('chao')
                    urban.push(item);
                } else if (item.type == 'Fiction') {
                    fiction.push(item);
                } else if (item.type == 'Myth') {
                    myth.push(item);
                } else if (item.type == 'horror') {
                    horror.push(item);
                }
                console.log(item.type);
            })
            setUrbanList(urban);
            setFictionList(fiction);
            setMythList(myth);
            setHorrorList(horror);
        });
        HandelPosTypeManga(positionCurrent.current); // dữ nguyên kiểu của loại truyện
    }
    const [typeMangaColor, setTypeMangaColor] = useState(['#FF8080', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']);
    // array thể loại truyện 
    const arrayType = ['All', 'Urban', 'Fiction', 'Myth', 'horror'];
    const HandelPosTypeManga = (pos) => {
        switch (pos) {
            case 0:
                setTypeMangaColor(['#FF8080', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']);
                positionCurrent.current = 0;
                setData(allData);
                break;
            case 1:
                setTypeMangaColor(['#FFFFFF', '#FF8080', '#FFFFFF', '#FFFFFF', '#FFFFFF']);
                positionCurrent.current = 1;
                setData(urbanList);
                break;
            case 2:
                setTypeMangaColor(['#FFFFFF', '#FFFFFF', '#FF8080', '#FFFFFF', '#FFFFFF']);
                positionCurrent.current = 2;
                setData(fictionList);
                break;
            case 3:
                setTypeMangaColor(['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FF8080', '#FFFFFF']);
                positionCurrent.current = 3;
                setData(mythList);
                break;
            case 4:
                setTypeMangaColor(['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FF8080']);
                positionCurrent.current = 4;
                setData(horrorList);
                break;
            default:
                setTypeMangaColor(['#FF8080', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']);
                positionCurrent.current = 0;
                setData(allData)
                break;
        }
    }
    // load lai data
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        setRefreshing(true);
        getDatabase();
        HandelPosTypeManga(positionCurrent.current); // dữ nguyên kiểu của loại truyện
        // sau khi xử lý xong công việc thì mới cho true
        setTimeout(() => setRefreshing(false), 1000);
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <View style={[styles.boxSearch, styles.shadowProp]}>
                    <Ionicons name="search" size={20} style={styles.searchIcon} />
                    <TextInput placeholder="Search" style={styles.searchInput}
                        onPressIn={() => navigation.navigate('search')}
                    />
                </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            tintColor={'#FF8080'}
                            colors={['#FF8080']}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <View style={styles.boxTypeManga}>
                        {
                            arrayType.map((item, index) => {
                                return <TouchableOpacity key={index} onPress={() => { HandelPosTypeManga(index), onRefresh() }}>
                                    <View style={[styles.box_item, { borderBottomColor: typeMangaColor[index] }]}>
                                        <Text style={styles.name}>{item}</Text>
                                    </View>
                                </TouchableOpacity>
                            })
                        }
                    </View>
                    <View style={styles.listManga}>
                        {data != null
                            ? data.map((item, index) => {
                                return <TouchableOpacity key={index} onPress={() => navigation.navigate('descriptionStory',
                                    {
                                        item: item,
                                        home: false,
                                    })}
                                >
                                    <BoxLightNovel value={item}></BoxLightNovel>
                                </TouchableOpacity>
                            })
                            : <Text style={{ textAlign: 'center' }}>NOT LIST 😒😒</Text>
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        ...Platform.select({
            android: {
                paddingTop: 15,
            }
        })
    },
    boxSearch: {
        flexDirection: "row",
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 7,
        backgroundColor: "#FFFFFF",
        width: '100%',
        zIndex: 1,
        marginBottom: 0.9,
    },
    shadowProp: {
        shadowColor: '#171717',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    searchIcon: {
        position: 'absolute',
        top: 14,
        left: 18,
        zIndex: 1,
        color: '#FF8080',
        ...Platform.select({
            android: {
                position: 'absolute',
                top: 19,
            }
        })
    },
    searchInput: {
        backgroundColor: '#F4F1F2',
        width: '100%',
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 30,
        paddingRight: 10,
        borderRadius: 15,
    },
    // type manga
    boxTypeManga: {
        padding: 10,
        paddingTop: 0,
        ...Platform.select({
            ios: {
                paddingTop: 10,
            }
        }),
        paddingBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
    },
    box_item: {
        width: windowWidth / 3.3,
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
    name: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
        alignSelf: 'center',
        color: '#525354'
    },
    // list truyen
    listManga: {
        padding: 10,
        paddingBottom: 0,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
})