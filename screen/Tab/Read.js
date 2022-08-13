import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function Read({ route, navigation }) {
    const { pos, data } = route.params;
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons style={styles.iconHeader} name="chevron-back-outline" />
            </TouchableOpacity>
            <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={data}
                initialScrollIndex={pos-1}
                renderItem={({ item }) => {
                    return <View style={styles.contentStory}>
                        <Text style={styles.titleChapter}>Chapter : {item.chap.chap} {item.name.name}</Text>
                        <Text style={styles.textContent}>
                            {item.content.content}
                        </Text>
                    </View>
                }}
                keyExtractor={item => item.chap.chap}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: "#FFFFFF",
    },
    iconHeader: {
        fontSize: 25,
        color: "#FF8080",
    },
    contentStory: {
        borderBottomColor: '#F8F4F5',
        borderBottomWidth: 6,
        paddingBottom: 30,
    },
    titleChapter: {
        fontSize: 20,
        marginBottom: 20,
        color: '#525354',
    }
})