import {
    View, Text, TextInput, TouchableOpacity, SafeAreaView,
    TouchableWithoutFeedback, Keyboard, StyleSheet, ScrollView
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

// DataSearch 
import DataSearch from '../../components/DataSearch';
// connect database
import firebase, { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
// import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

export default function Search({ navigation }) {
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
    const [data, setData] = useState(null);
    const [dataSearch, setDataSearch] = useState(null);
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
        });
    }
    const handleSearch = (text) => {
        let array = data.filter((item) => {
            return item.name.toLowerCase().includes(text.toLowerCase());
        });
        console.log(array.length);
        setDataSearch(array);
    }
    return (
        <SafeAreaView style={styles.container} onPress={Keyboard.dismiss}>
            <View style={[styles.boxSearch, styles.shadowProp]}>
                <Ionicons name="search" size={20} style={styles.searchIcon} />
                <TextInput placeholder="Search" onChangeText={(text) => handleSearch(text)} style={styles.searchInput} />
                <Text style={styles.searchCancel}  onPress={() => navigation.goBack()}>Cancel</Text>
            </View>
            <View style={{ paddingRight: 10, paddingLeft: 10 }}>
                <ScrollView
                    // horizontal={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {dataSearch != null
                        ? dataSearch.length == 0
                            ? <Text>There is no such story</Text>
                            : dataSearch.map((item, index) => {
                                return <TouchableOpacity key={index}   onPress={() => navigation.navigate('descriptionStory', 
                                {
                                    item: item,
                                    home: false,})}>
                                    <DataSearch value={item}></DataSearch>
                                </TouchableOpacity>
                            })
                        : <Text>Enter in the Search Box to Find Stories</Text>
                    }
                </ScrollView>
            </View>

        </SafeAreaView>
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
        alignItems: "center"
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
        // width: '100%',
        flexGrow: 1,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 30,
        paddingRight: 10,
        borderRadius: 15,
    },
    searchCancel:{
        fontSize: 13,
        marginLeft: 10,
        color: '#FF8080'
    },
})