import React, { useContext } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, StatusBar } from 'react-native';

import { AuthContext } from '../Navigation'
import SearchTable from './SearchTable'

export default function Home(props) {
    const { signOut } = useContext(AuthContext).authContext;
    const { userInfo } = useContext(AuthContext)

    return(
        <View style={styles.container}>
            <StatusBar></StatusBar>
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={styles.userName}>{userInfo.name} {userInfo.lastName}</Text>
                    <Text>{userInfo.email}</Text>
                </View>
                <View style={styles.column}>
                    <TouchableOpacity
                        style = {styles.button}
                        onPress = {() => signOut()}
                    >
                        <Text style={styles.buttonText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.searchContainer}>
                <SearchTable userInfo={userInfo} navigation={props.navigation}></SearchTable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    button: {
        width: '50%',
        backgroundColor: '#3273dc',
        borderRadius: 5,
        margin: 10,
        padding: 10,
    },
    buttonText:{
        color: 'white',
        alignSelf: 'center'
    },
    userName: {
        fontWeight: 'bold', 
        fontSize: 18
    },
    searchContainer: {
        alignItems:'center', 
        marginTop: '30%'
    },
    row: {
        flexDirection: 'row'
    },
    column: {
        flexDirection: 'column',
        margin: 20,
        justifyContent: 'center',
        width: '50%'
    }
});