import {
    View, Text, SafeAreaView, TextInput, StyleSheet,
    TouchableWithoutFeedback, Keyboard, Image, Dimensions,
    TouchableOpacity, Platform, ScrollView, RefreshControl
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import dptk from '../../assets/image/banner/dptk.jpg'
import onepicec from '../../assets/image/banner/onepicec.jpg'
import thntltp from '../../assets/image/banner/thntltp.jpg'
import tinhthanbien from '../../assets/image/banner/tinhthanbien.jpg'
import tvdt from '../../assets/image/banner/tvdt.jpg'

// icon 
import favorites from '../../assets/image/icon/favorite.png'
import news from '../../assets/image/icon/new.png'
import rating from '../../assets/image/icon/rating.png'
import Swiper from 'react-native-swiper'
// chart 
//  hottest
import BoxHorizontal from '../../components/BoxHorizontal';

// new Update 
import NewManga from '../../components/NewManga';

// Load
import Load from '../../components/Load';
// connect database
import firebase, { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
// import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function Home({ navigation }) {
    const [dataStory, setDataStory] = useState(null);
    // data truyện đứng đầu bảng , chỉ lấy 4 truyện 
    const [dataHottestSlice, setDataHottestSlice] = useState(null);
    const [dataFavoriteSlice, setDataFavoriteSlice] = useState(null);
    const [dataNewMangaSlice, setDataNewMangaSlice] = useState(null);
    const [chartTopStory, setChartStory] = useState(null);

    // data 
    const [dataHottest, setDataHottest] = useState(null);
    const [dataFavorite, setDataFavorite] = useState(null);
    const [dataNewManga, setDataNewManga] = useState(null);
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
            setDataStory(array);
            console.log('vip');
            // console.log(array);
            // lấy truyện được xem nhiều nhất 
            let array2 = [...array];
            setDataHottest(array2); // lấy tất cả các truyện có view cao đến thấp 
            array2.sort((data1, data2) => data2.view - data1.view);
            let newArray2 = array2.slice(0, 4);
            setDataHottestSlice(newArray2);
            // setChartStory(newArray2); // load xong thi hiển thị truyện được xem nhiều nhất trước 
            // lấy truyện được yêu thích nhất
            let array3 = [...array];
            array3.sort((data1, data2) => data2.favorite - data1.favorite);
            setDataFavorite(array3); // lấy tất cả truyện tranh được yêu thích nhất từ cao đên thấp 
            let newArray3 = array3.slice(0, 4);
            setDataFavoriteSlice(newArray3);
            // truyện mới được cập nhật 
            let array4 = [...array];
            let conditionArray4 = [];
            // const conditionArray4 = array4.map((item, index) => {
            //     return item.newManga == true
            // })
            for (const value of array4) {
                if (value.newManga == true) {
                    conditionArray4.push(value)
                }
            }
            setDataNewManga(conditionArray4); // lấy toàn bộ truyện mới nhất
            let newArray4 = conditionArray4.slice(0, 4); // chỉ lấy 4 truyện mới
            setDataNewMangaSlice(newArray4);
        });
    }
    const [chartBottomColor, setChartBottomColor] = useState(['#FF8080', '#FFFFFF', '#FFFFFF']);
    function handelChartBottomColor(pos) {
        switch (pos) {
            case 1:
                setChartBottomColor(['#FF8080', '#FFFFFF', '#FFFFFF']);
                setChartStory(dataHottestSlice);
                break;
            case 2:
                setChartBottomColor(['#FFFFFF', '#FF8080', '#FFFFFF']);
                setChartStory(dataFavoriteSlice);
                break;
            case 3:
                setChartBottomColor(['#FFFFFF', '#FFFFFF', '#FF8080']);
                // console.log(dataNewManga.length);
                // console.log(dataNewManga[0].newManga);
                setChartStory(dataNewMangaSlice);
                break;
            default:
                setChartBottomColor(['#FF8080', '#FFFFFF', '#FFFFFF']);
                setChartStory(dataHottestSlice);
                break;
        }
    }
    const [refreshing, setRefreshing] = useState(false);
    // toàn bộ dữ liệu
    const onRefresh = () => {
        // console.log('chao');
        setRefreshing(true);
        getDatabase();
        // sau khi xử lý xong công việc thì mới cho true
        setTimeout(() => setRefreshing(false), 2000);
    }
    // dữ liệu box chart
    const onRefreshChart = () => {
        getDatabase();
        // console.log('chao');
        setRefreshing(true);
        // sau khi xử lý xong công việc thì mới cho true
        setTimeout(() => setRefreshing(false), 1000);
    }
    function handleView(view, id) {
        console.log('chao');
        console.log(view);
        let a = view + 1;
        firebase.database().ref('LightNovel/' + id + '/view').set({
            view: a
        });
    }
    return (
        <SafeAreaView style={styles.container} onPress={Keyboard.dismiss}>
            <View style={[styles.boxSearch, styles.shadowProp]}>
                <Ionicons name="search" size={20} style={styles.searchIcon} />
                <TextInput placeholder="Search" style={styles.searchInput} onPressIn={() => navigation.navigate('search')} />
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        tintColor={'#FF8080'}
                        colors={['#FF8080']}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={styles.boxBanner}>
                    <Swiper
                        showsButtons={true}
                        dot={
                            <View style={{ backgroundColor: '#DCE0DB', width: 5, height: 5, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 8, marginBottom: 0, }} />
                        }
                        activeDot={
                            <View style={{ backgroundColor: '#B5B7B4', width: 5, height: 5, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 8, marginBottom: 0, }} />
                        }
                        paginationStyle={{
                            bottom: 10
                        }}
                        nextButton={<Text style={styles.buttonBanner}>›</Text>}
                        prevButton={<Text style={styles.buttonBanner}>‹</Text>}
                        autoplay={true}
                    >
                        <Image source={dptk} style={styles.ImageBanner} />
                        <Image source={onepicec} style={styles.ImageBanner} />
                        <Image source={thntltp} style={styles.ImageBanner} />
                        <Image source={tinhthanbien} style={styles.ImageBanner} />
                        <Image source={tvdt} style={styles.ImageBanner} />
                        {/* {(item.listImage).map((item2, pos) => {
                        return <Image key={pos} source={{ uri: 'data:image/jpeg;base64,' + item2 }} style={styles.ImagePost} />
                    })} */}
                    </Swiper>
                </View>
                {/* bang xep hang */}
                <View style={styles.boxChart}>
                    <View style={[styles.boxChart_Item, { borderBottomColor: chartBottomColor[0] }]}>
                        <TouchableOpacity style={styles.boxChart_Item_button} onPress={() => { handelChartBottomColor(1), onRefreshChart() }}>
                            <Image source={rating} style={styles.imageChart} />
                            <Text style={styles.chartText}>Hottest</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.boxChart_Item, { borderBottomColor: chartBottomColor[1] }]}>
                        <TouchableOpacity style={styles.boxChart_Item_button}
                            onPress={() => {
                                handelChartBottomColor(2),
                                    onRefreshChart()
                            }
                            }>
                            <Image source={favorites} style={styles.imageChart} />
                            <Text style={styles.chartText}>Favorite</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.boxChart_Item, { borderBottomColor: chartBottomColor[2] }]}>
                        <TouchableOpacity style={styles.boxChart_Item_button} onPress={() => { handelChartBottomColor(3), onRefreshChart() }}>
                            <Image source={news} style={styles.imageChart} />
                            <Text style={styles.chartText}>New Manga</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* content bang xep hang */}
                <View style={styles.BoxContentChart}>
                    {chartTopStory != null
                        ? chartTopStory.map((item, index) => {
                            return <TouchableOpacity key={index} onPress={() => {
                                navigation.navigate('descriptionStory', {
                                    item: item,
                                    home: true
                                });
                                handleView(item.view, item.id);
                            }}>
                                <BoxHorizontal value={item}></BoxHorizontal>
                            </TouchableOpacity>
                        })
                        : dataHottestSlice != null
                            ? dataHottestSlice.map((item, index) => {
                                return <TouchableOpacity key={index} onPress={() => {
                                    navigation.navigate('descriptionStory', {
                                        item: item,
                                        home: true
                                    })
                                        ;
                                    handleView(item.view, item.id);
                                }}>
                                    <BoxHorizontal value={item}></BoxHorizontal>
                                </TouchableOpacity>
                            })
                            : <Load></Load>
                    }
                </View>
                <Text style={styles.textTitle}>🎉 New Update</Text>
                <ScrollView
                    horizontal={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {dataNewManga != null
                        ? dataNewManga.map((item, index) => {
                            return <TouchableOpacity key={index} onPress={() => {
                                navigation.navigate('descriptionStory', {
                                    item: item,
                                    home: true
                                });
                                handleView(item.view, item.id);
                            }}>
                                <NewManga value={item}></NewManga>
                            </TouchableOpacity>
                        })
                        : <Text>No stories have been updated</Text>
                    }
                </ScrollView>
                <Text style={styles.textTitle2}>⚡Nomination Board</Text>
                <ScrollView
                    horizontal={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {dataHottest != null
                        ? dataHottest.map((item, index) => {
                            return<TouchableOpacity key={index} onPress={() => {
                                navigation.navigate('descriptionStory', {
                                    item: item,
                                    home: true
                                });
                                handleView(item.view, item.id);
                            }}>
                                <View style={styles.nominate}>
                                    <Image source={{ uri: 'data:image/jpeg;base64,' + item.poster }} style={styles.imageNominate} />
                                    <Text style={styles.nameNominate}>{item.name}</Text>
                                    <Text style={styles.typeNominate}>{item.type}</Text>
                                </View>
                            </TouchableOpacity>
                        })
                        : <Text>chiu</Text>
                    }
                </ScrollView>
                <Text style={styles.textTitle2}>💥Light Novel Hot</Text>
                <ScrollView
                    horizontal={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {dataFavorite != null
                        ? dataFavorite.map((item, index) => {
                            return <TouchableOpacity key={index} onPress={() => {
                                navigation.navigate('descriptionStory', {
                                    item: item,
                                    home: true
                                });
                                handleView(item.view, item.id);
                            }}>
                                <View style={styles.nominate}>
                                    <Image source={{ uri: 'data:image/jpeg;base64,' + item.poster }} style={styles.imageNominate} />
                                    <Text style={styles.nameNominate}>{item.name}</Text>
                                    <Text style={styles.typeNominate}>{item.type}</Text>
                                </View>
                            </TouchableOpacity>
                        })
                        : <Text>chiu</Text>
                    }
                </ScrollView>
                <Text style={styles.textTitle2}>🔥Manga Hot</Text>
                <ScrollView
                    horizontal={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {/* <TouchableOpacity>
                        <Nominate></Nominate>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Nominate></Nominate>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Nominate></Nominate>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Nominate></Nominate>
                    </TouchableOpacity> */}
                </ScrollView>
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
    // banner
    boxBanner: {
        height: windowHeight / 3,
    },
    ImageBanner: {
        height: windowHeight / 3,
        width: '100%',
    },
    buttonBanner: {
        fontSize: 40,
        color: '#FFFFFF',
    },
    // style bảng xếp hạng 
    boxChart: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    boxChart_Item: {
        // borderColor: '#000',
        // borderWidth: 1,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        marginRight: 15,
        marginLeft: 15,
        borderBottomWidth: 3,
    },
    chartText: {
        color: '#525354',
        fontWeight: '600',
        fontSize: 12,
    },
    boxChart_Item_button: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageChart: {
        width: 30,
        height: 30,
    },
    // content box chart
    BoxContentChart: {
        paddingTop: 25,
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    // title 
    textTitle: {
        fontWeight: '500',
        marginLeft: 10,
        marginBottom: 15,
        ...Platform.select({
            android: {
                fontSize: 12,
            }
        })
    },
    textTitle2: {
        fontWeight: '500',
        marginLeft: 5,
        marginBottom: 15,
        ...Platform.select({
            android: {
                fontSize: 12,
            }
        })
    },
    // Nominate 
    nominate: {
        width: windowWidth / 2.6,
        marginRight: 8,
        marginBottom: 15,
        ...Platform.select({
            android: {
                width: windowWidth / 3.3,
            }
        })
    },
    imageNominate: {
        width: windowWidth / 2.6,
        height: windowHeight / 3.5,
        borderRadius: 5,
        marginBottom: 3,
        ...Platform.select({
            android: {
                width: windowWidth / 3.3,
            }
        })
    },
    nameNominate: {
        fontSize: 9.5,
        fontWeight: '600',
        color: '#525354',
        marginBottom: 2,
    },
    typeNominate: {
        color: '#999C9E',
        fontWeight: '600',
        fontSize: 8,
    }
})