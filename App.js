import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screen/Login';
import Register from './screen/Register';
import Data from './screen/Data';
import BottomTab from './screen/BottomTab';

const Stack = createNativeStackNavigator();
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen options={{ headerShown: false }} name='Login' component={Login} />
                <Stack.Screen options={{ headerShown: false }} name='Register' component={Register} />
                <Stack.Screen options={{ headerShown: false }} name='Data' component={Data} />
                <Stack.Screen options={{ headerShown: false }} name='BottomTab' component={BottomTab} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
