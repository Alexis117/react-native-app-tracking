import React, { useContext } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { AuthContext } from '../Navigation'

export default function Home() {
    const { signOut } = useContext(AuthContext);

    return(
        <View style={styles.container}>
            <Text>Home</Text>
            <TouchableOpacity
                style = {styles.button}
                onPress = {() => signOut()}
            >
                <Text style={styles.whiteText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
        backgroundColor: '#3273dc',
        borderRadius: 5,
        margin: 10,
        padding: 10,
    },
    whiteText:{
        color: 'white'
    },
    link: {
        color:'#3273dc', 
        textDecorationLine:'underline', 
        alignSelf:'center'
    },
    textInput: {
        borderStyle: 'solid',
        borderColor: 'black',
        borderRadius: 4,
        borderWidth: 1,
        padding: 2,
        margin: 2,
    },
    form: {
        width: '80%'
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    error: {
        color: 'red',
        marginTop: 10
    }
});