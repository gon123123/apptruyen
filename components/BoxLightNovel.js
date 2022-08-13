import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import React from 'react'

import nghichthien from '../assets/image/lightNovel/nghichthien.jpg';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function BoxLightNovel(props) {
    const item  = props.value ;
    return (
        <View style={styles.box}>
            <Image source={{ uri: 'data:image/jpeg;base64,' + item.poster }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    box: {
        width: windowWidth / 3.3,
        // backgroundColor: 'red',
        marginBottom: 10
    },
    image: {
        width: windowWidth / 3.3,
        height: windowHeight / 3.8,
        marginBottom: 5,
        borderRadius: 7
    },
    name: {
        fontSize: 8,
        fontWeight: '500',
        // color: '#999C9E'
    },
})