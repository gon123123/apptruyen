import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import React from 'react'
import nguyenton1 from '../assets/image/chart/hottest/nguyenton1.jpg'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function BoxHorizontal(props) {
    const item = props.value;
    return (
        <View style={styles.BoxContent_item}>
            <Image source={{ uri: 'data:image/jpeg;base64,' + item.banner }} style={[styles.image, styles.imageProp]} />
            <Text style={styles.description} numberOfLines={1}>{item.description}</Text>
            <Text style={styles.name}>{item.name} 👑</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    BoxContent_item: {
        width: windowWidth / 2.1,
        marginBottom: 15,
        ...Platform.select({
            ios: {
                width: windowWidth / 2.2,
            }
        })
    },
    image: {
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
    imageProp: {
        shadowColor: '#171717',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    description: {
        fontSize: 9,
        fontWeight: '500',
        marginBottom: 3,
        // textOverflow: 'ellipsis',
    },
    name: {
        color: '#999C9E',
        fontWeight: '500',
        fontSize: 8,
    }
})