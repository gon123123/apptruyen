import { View, Text, Platform, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './Tab/Home';
import Search from './Tab/Search';
import DescriptionStory from './Tab/DescriptionStory';
import Read from './Tab/Read';
import LightNovel from './Tab/LightNovel';
import MyBook from './Tab/MyBook';
import Me from './Tab/Me';
import Login from './Login';

const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen options={{ headerShown: false }} name="home" component={Home} />
            <HomeStack.Screen options={{ headerShown: false }} name="search" component={Search} />
            <HomeStack.Screen options={{ headerShown: false }} name="descriptionStory" component={DescriptionStory} />
            <HomeStack.Screen options={{ headerShown: false }} name="read" component={Read} />
        </HomeStack.Navigator>
    );
}
const LightNovelStack = createNativeStackNavigator();
function LightNovelStackScreen() {
    return (
        <LightNovelStack.Navigator>
            <LightNovelStack.Screen options={{ headerShown: false }} name="lightNovel" component={LightNovel} />
            <LightNovelStack.Screen options={{ headerShown: false }} name="search" component={Search} />
            <HomeStack.Screen options={{ headerShown: false }} name="descriptionStory" component={DescriptionStory} />
            <HomeStack.Screen options={{ headerShown: false }} name="read" component={Read} />
        </LightNovelStack.Navigator>
    );
}
const MyBookStack = createNativeStackNavigator();
function MyBookStackScreen() {
    return (
        <MyBookStack.Navigator>
            <MyBookStack.Screen options={{ headerShown: false}} name="myBook" component={MyBook} />
            <HomeStack.Screen options={{ headerShown: false }} name="descriptionStory" component={DescriptionStory} />
            <HomeStack.Screen options={{ headerShown: false }} name="read" component={Read} />
        </MyBookStack.Navigator>
    );
}
const MeStack = createNativeStackNavigator();
function MeStackScreen() {
    return (
        <MeStack.Navigator>
            <MeStack.Screen options={{ headerShown: false }} name="me" component={Me} />
        </MeStack.Navigator>
    );
}
export default function BottomTab() {
    const [heightTabBar, setHeightTabBar] = useState(45);
    useEffect(() => {
        const shoKeyboard = Keyboard.addListener("keyboardDidShow", () => {
            setHeightTabBar(0);
        })
        const hideKeyboard = Keyboard.addListener("keyboardDidHide", () => {
            setHeightTabBar(45);
        })

        return () => {
            shoKeyboard.remove();
            hideKeyboard.remove();
        }
    }, []);
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: {
                    height: heightTabBar,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    // console.log(route);
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'ios-home' : 'ios-home-outline';
                    } else if (route.name === 'Light Novel') {
                        iconName = focused ? 'book' : 'book-outline';
                    } else if (route.name === 'My Book') {
                        iconName = focused ? 'star' : 'star-outline';
                    } else if (route.name === 'Me') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={20} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: {
                    fontSize: 10,
                    ...Platform.select({
                        android: {
                            fontSize: 7,
                        }
                    })
                },
            })
            }
        >
            <Tab.Screen
                options={{
                    // tabBarBadge: 3,
                    // tabBarBadgeStyle: { backgroundColor: 'blue' },
                    headerShown: false,
                    // headerStyle: {
                    //     backgroundColor: 'tomato',
                    // },
                    // headerTitleAlign: 'center',
                    // headerTitleStyle: {
                    //     color: 'white',
                    // }
                }}
                name="Home" component={HomeStackScreen} />
            <Tab.Screen
                options={{
                    // tabBarBadge: 3,
                    headerShown: false,
                }}
                name="Light Novel" component={LightNovelStackScreen} />
            <Tab.Screen
                options={{
                    // tabBarBadge: 3,
                    headerShown: false,
                    headerStyle: {

                    },
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 15,
                    }
                }}
                name="My Book" component={MyBookStackScreen} />
            <Tab.Screen
                options={{
                    // tabBarBadge: 3,
                    tabBarBadgeStyle: {
                        backgroundColor: '#FF8080',
                        color: '#FFFFFF',
                        ...Platform.select({
                            android: {
                                fontSize: 10,
                                flex: 1,
                                alignSelf: 'center',
                                lineHeight: 13
                            }
                        })
                    },
                    headerShown: false,
                    headerStyle: {
                    },
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 15,
                    }
                }}
                name="Me" component={MeStackScreen} />
        </Tab.Navigator>
    )
}