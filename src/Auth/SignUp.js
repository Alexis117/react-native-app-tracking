import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function SignUp(props) {
    return(
        <View style={styles.container}>
            <Text>Sign Up Page</Text>
            <TouchableOpacity
                //style={styles.button}
                onPress = {() => props.navigation.navigate('Login')}
            >
                <Text style={styles.link}>Login</Text>
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
    }
});