import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery, useSubscription, gql } from '@apollo/client'

const ALL_USERS = gql`
query{
    allUsers{
        name
        email
    }
}
`

const GET_LOCATION = gql`
subscription{
    getLocation(uuid:"2bbb7c58-3846-4a76-a612-ea9d178f5fc0"){
        latitude
        longitude
      }
}
`
export default function Test() {

    const { loading, error, data } = useSubscription(GET_LOCATION);
    //const {loading, data, error} = useQuery(ALL_USERS);


    if (loading) return (
        <View style={styles.container}>
            <Text>Loading...</Text>
        </View>
    );
    if (error) console.log(error);
    if (data) console.log(data);

    return (
        <View style={styles.container}>
            <Text>Hola Mundo!</Text>
            <StatusBar style="auto" />
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
  });