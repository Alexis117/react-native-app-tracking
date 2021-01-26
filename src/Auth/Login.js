import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AuthContext } from '../Navigation'

export default function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState();

    const { signIn } = useContext(AuthContext);

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Geo Tracking App</Text>
            <Text style={styles.subtitle}>Login</Text>
            <View style={styles.form}>
                <TextInput
                    style = {styles.textInput}
                    value = {email}
                    onChangeText = {text => setEmail(text)}
                    placeholder='Email'
                />
                <TextInput
                    style = {styles.textInput}
                    value = {password}
                    onChangeText = {text => setPassword(text)}
                    secureTextEntry = {true}
                    placeholder='Password'
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress = {() => signIn({ email, password }).then(res => {
                    if (res)
                        setError(res.data.login.message)
                })}
            >
                <Text style={styles.whiteText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress = {() => props.navigation.navigate('SignUp')}
            >
                <Text style={styles.link}>Sign up</Text>
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}
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