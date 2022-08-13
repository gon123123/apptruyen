import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import React from 'react'
import thuatsi  from '../assets/image/thuatsi.jpg'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function NewManga(props) {
    const item = props.value ;
    return (
        <View style={styles.boxNewUpdate}>
            <Image source={{ uri: 'data:image/jpeg;base64,' + item.banner }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    // New update 
    boxNewUpdate: {
        width: windowWidth / 2.1,
        marginRight: 8,
        marginBottom: 15,
        ...Platform.select({
            ios: {
                width: windowWidth / 2,
                // height: windowHeight / 5.5
            }
        })
    },
    image: {
        width: windowWidth / 2.1,
        height: windowHeight / 5.5,
        borderRadius: 7,
        marginBottom: 3,
        ...Platform.select({
            ios: {
                width: windowWidth / 2,
            }
        })
    },
    name: {
        fontSize: 9.5,
        fontWeight: '500',
        color: '#525354'
    }
})