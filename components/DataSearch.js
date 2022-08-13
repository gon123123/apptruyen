import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import React from 'react'

import thuatsi1 from '../assets/image/thuatsi2.jpg';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function dataSearch(props, { navigation }) {
    const item = props.value;
    return (
        <View style={styles.nominate}>
            <Image source={{ uri: 'data:image/jpeg;base64,' + item.poster }} style={styles.imageNominate} />
            <View style={styles.nominateRight}>
                <Text style={styles.nameNominate}>{item.name}</Text>
                <Text style={styles.typeNominate}>{item.type}</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    // Nominate 
    nominate: {
        width: windowWidth / 2.6,
        marginRight: 8,
        marginBottom: 15,
        ...Platform.select({
            android: {
                width: windowWidth / 3.3,
            }
        }),
        flexDirection: 'row',
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
        }),
        marginRight: 10,
    },
    nominateRight: {
        alignItems: 'flex-start'
    },
    nameNominate: {
        fontSize: 16,
        fontWeight: '600',
        color: '#525354',
        marginBottom: 2,
    },
    typeNominate: {
        color: '#999C9E',
        fontWeight: '600',
        fontSize: 10,
        marginTop: 20,
        backgroundColor: '#F8F4F5',
        padding: 2,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 4
    }
})
