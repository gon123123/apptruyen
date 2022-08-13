import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'

export default function Data({ navigation }) {
    const [data, setData] = useState(null);
    // fetch('http://localhost:3000/user')
    //         .then(response => response.json())
    //         // .then(json => setData(json.user))
    //         .then(json => console.log("chao ban: "+ json.user))
    //         .catch(err => console.error(err))
    // useEffect(() => {
    //     fetch('https://gon123123.github.io/db.json')
    //         .then(response => response.json())
    //         .then(json => setData(json.user))
    //         .catch(err => console.error(err))
    // }, []);
    return (
        <SafeAreaView>
            <Text>Data</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text>Quay lai</Text>
            </TouchableOpacity>
            {/* {data != null
                ? data.map(item => {
                    return <View key={item.id}>
                        <Text>{item.id}</Text>
                        <Text>{item.name}</Text>
                        <Text>{item.password}</Text>
                        <Text>{item.address}</Text>
                        <Text>{item.description}</Text>
                        <Text>{item.age}</Text>
                        <Text>{item.experience}</Text>
                    </View>
                }):
                <ActivityIndicator size="large" color="#00ff00" />
                } */}
        </SafeAreaView>
    )
}