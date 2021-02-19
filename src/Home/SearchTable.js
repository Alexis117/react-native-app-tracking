import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function SearchTable() {
    return(
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style = {styles.textInput}
                    //value = {email}
                    //onChangeText = {text => setEmail(text)}
                    placeholder='Buscar usuario'
                />
            </View>
            <View style={styles.box}>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.userText}>Usuario 1</Text>
                        <Text>correo@ejemplo.com</Text>
                    </View>
                    <View style={styles.column}>
                        <TouchableOpacity
                            style = {styles.button}
                            onPress = {() => signOut()}
                        >
                            <Text style={styles.buttonText}>Track</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '95%',
        height: '100%'
    },
    box: {
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        height: '60%'
    },
    row: {
        flexDirection: 'row'
    },
    column: {
        flexDirection: 'column',
        width: '50%',
        margin: 20,
        justifyContent: 'center'
    },
    textInput: {
        borderStyle: 'solid',
        borderColor: 'black',
        borderRadius: 4,
        borderWidth: 1,
        padding: 2    
    },
    searchContainer: {
        marginBottom: 10
    },
    userText: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#3273dc',
        borderRadius: 5,
        padding: 5,
        width: '50%'
    },
    buttonText:{
        color: 'white',
        alignSelf: 'center'
    },
});