import {
    View, Text, SafeAreaView, StyleSheet, TextInput,
    TouchableWithoutFeedback, Keyboard, TouchableOpacity,
    Image, Dimensions, ScrollView, Platform, ActivityIndicator, RefreshControl
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

import dbtd from '../../assets/image/dbtd.jpg' // anh 

// load 
import Load from '../../components/Load'
//  connection data base 
import * as SQLite from 'expo-sqlite';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function MyBook({ navigation }) {
    const [option, setOption] = useState(['#FF8080', '#FFFFFF', '#FFFFFF']);
    const [nameOption, setNameOption] = useState(['Download', 'Follow', 'History']);
    const [listStoryDownload, setListStoryDownload] = useState(null);
    useEffect(() => {
        getDatabase();
    }, []);
    const HandelPosOption = (pos) => {
        switch (pos) {
            case 0:
                setOption(['#FF8080', '#FFFFFF', '#FFFFFF'])
                break;
            case 1:
                setOption(['#FFFFFF', '#FF8080', '#FFFFFF'])
                break;
            case 2:
                setOption(['#FFFFFF', '#FFFFFF', '#FF8080'])
                break;
            default:
                setOption(['#FF8080', '#FFFFFF', '#FFFFFF'])
                break;
        }
    }
    function openDatabase() {
        const db = SQLite.openDatabase("db.db");
        return db;
    }
    const db = openDatabase();
    // load data
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        setRefreshing(true);
        // sau khi xử lý xong công việc thì mới cho false
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM storyDownload ORDER BY id DESC`,
                [],
                (sqlTxn, res) => {
                    let len = res.rows.length;
                    if (len > 0) {
                        let result = [];
                        for (let i = 0; i < len; i++) {
                            let item = res.rows.item(i);
                            result.push({
                                id: item.id,
                                key: item.key,
                                name: item.name,
                                description: item.description,
                                poster: item.poster,
                                banner: item.banner,
                                chapter: item.chapter,
                                type: item.type,
                                data: JSON.parse(item.data),
                                view: item.view,
                                favorite: item.favorite
                            })
                        }
                        console.log(len);
                        setListStoryDownload(result);
                    }
                },
                (error) => {
                    console.log('error on adding storyDownload ' + error.message);
                    setListStoryDownload(null);
                }
            );
        })
        setTimeout(() => setRefreshing(false), 2000);
    }
    const handleDeleteStory = (id) => {
        console.log(id);
        let sql = "DELETE FROM storyDownload WHERE id=" + id;
        db.transaction((tx) => {
            tx.executeSql(
                sql,
                [],
                (sqlTxn, res) => {
                    console.log('delete success');
                    setListStoryDownload([]);
                    getDatabase();
                },
                error => {
                    console.log('error on deleting ' + error.message);
                }
            )
        })
    }
    const getDatabase = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM storyDownload ORDER BY id DESC`,
                [],
                (sqlTxn, res) => {
                    let len = res.rows.length;
                    if (len > 0) {
                        let result = [];
                        for (let i = 0; i < len; i++) {
                            let item = res.rows.item(i);
                            result.push({
                                id: item.id,
                                key: item.key,
                                name: item.name,
                                description: item.description,
                                poster: item.poster,
                                banner: item.banner,
                                chapter: item.chapter,
                                type: item.type,
                                data: JSON.parse(item.data),
                                view: item.view,
                                favorite: item.favorite
                            })
                        }
                        console.log(len);
                        setListStoryDownload(result);
                    }
                },
                (error) => {
                    console.log('error on adding storyDownload ' + error.message);
                }
            );
        });
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.boxOption}>
                {/* {
                    nameOption.map((item, index) => {
                        return <TouchableOpacity key={index} onPress={() => { HandelPosOption(index), onRefresh() }}>
                            <View style={[styles.box_item, { borderBottomColor: option[index] }]}>
                                <Text style={styles.name}>{item}</Text>
                            </View>
                        </TouchableOpacity>
                    })
                } */}
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
                {listStoryDownload != null
                    ? listStoryDownload.length != 0
                        ? listStoryDownload.map((item, index) => {
                            return <View style={styles.boxManga} key={index}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('descriptionStory',
                                        {
                                            item: item,
                                            home: false,
                                        })}
                                >
                                    <View style={styles.box}>
                                        <Image source={{ uri: 'data:image/jpeg;base64,' + item.poster }} style={styles.image} />
                                        <View style={styles.description}>
                                            <View style={styles.boxTitle}>
                                                <Text style={styles.textName}>{item.name}</Text>
                                                <Ionicons style={styles.icon} name="trash"
                                                    onPress={() => handleDeleteStory(item.id)}
                                                />
                                            </View>
                                            <Text style={styles.textDescription}>Download {item.chapter} chapters</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        })
                        : <Text style={{ textAlign: 'center' }}>Empty Download List 😒😒</Text>
                    : <Text style={{ textAlign: 'center' }}>Empty Download List 😒😒</Text>
                }
            </ScrollView>
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
    boxOption: {
        // padding: 10,
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
        // backgroundColor: '#F8F8F8',
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
    // box description manga 
    boxManga: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
    },
    box: {
        flexDirection: 'row',
    },
    description: {
        flex: 1,
        width: '100%',
    },
    boxTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
    },
    textName: {
        fontSize: 14,
        fontWeight: '500',
    },
    image: {
        width: windowWidth / 3.3,
        height: windowHeight / 3.8,
        marginBottom: 5,
        marginRight: 8,
        borderRadius: 7
    },
    textDescription: {
        marginTop: 30,
        fontSize: 12,
        color: '#999C9E',
    },
    icon: {
        color: '#FF8080',
        fontSize: 20,
        ...Platform.select({
            android: {
                fontSize: 25
            }
        })
    },
})