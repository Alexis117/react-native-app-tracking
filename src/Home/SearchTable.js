import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useQuery, useMutation, gql } from '@apollo/client'

const GET_USERS = gql`
query allUsersFilter($searchString:String){
    allUsersFilter(searchString:$searchString){
        id
        name
        lastName
        email
        sharingLocation
    }
}
`

const IS_USER_SHARING_LOCATION = gql`
mutation shareStatus($id:String) {
    shareStatus(id:$id){
        isSharing
        latitude
        longitude
    }
}
`

export default function SearchTable(props) {
    const [ search, setSearch ] = useState('')
    const { data, loading, error } = useQuery(GET_USERS, {variables:{searchString:search}});
    const [ shareStatus ] = useMutation(IS_USER_SHARING_LOCATION)

    if (error) console.log(error)

    return(
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style = {styles.textInput}
                    value = {search}
                    onChangeText = {text => setSearch(text)}
                    placeholder='Buscar usuario'
                />
            </View>
            <View style={styles.box}>
                <FlatList
                    data={data ? data.allUsersFilter : []}
                    ListEmptyComponent = {() =><Text>No results found</Text>}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => {
                        if (props.userInfo.email != item.email) return (
                            <View style={styles.row}>
                                <View style={styles.column}>
                                    <Text style={styles.userText}>{item.name} {item.lastName}</Text>
                                    <Text>{item.email}</Text>
                                </View>
                                <View style={styles.column}>
                                    <TouchableOpacity
                                        style = {styles.button}
                                        onPress = {() => {
                                            shareStatus({variables:{id:item.id}}).then(res => {
                                                if (!res.data.shareStatus.isSharing)
                                                    Alert.alert('Not able to track', 'User is not sharing his location')
                                                else 
                                                    props.navigation.navigate('UserLocation', {user: item, location: res.data.shareStatus})
                                            })
                                        }}
                                    >
                                        <Text style={styles.buttonText}>Track</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }}
                />
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
        height: '65%'
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