import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSubscription, gql } from '@apollo/client';

const GET_LOCATION = gql`
subscription {
    getLocation(uuid:"bc938719-28f8-42e4-b20f-fd799166b62f"){
        latitude
        longitude
    }
}
`

export default function UserLocation(props) {
    const [ location, setLocation ] = useState({
        latitude: parseFloat(props.route.params.location.latitude),
        longitude: parseFloat(props.route.params.location.longitude)
    });
    const [ latitudeDelta, setLatitudeDelta ] = useState(0.0922);
    const [ longitudeDelta, setLongitudeDelta ] = useState(0.0421);
    const [ prev, setPrev ] = useState();

    const { loading, error, data } = useSubscription(GET_LOCATION, {variables:{uuid: props.route.params.user.id}});

    if (error) console.log(error)
    if (data) if (data != prev) {
        setLocation({
            latitude: parseFloat(data.getLocation.latitude),
            longitude: parseFloat(data.getLocation.longitude)
        })
        setPrev(data)
    } 

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta,
                }}
                onRegionChangeComplete={region => {
                    setLatitudeDelta(region.latitudeDelta)
                    setLongitudeDelta(region.longitudeDelta)
                }}
            >
                <Marker
                    coordinate={{latitude: location.latitude, longitude: location.longitude}}
                >
                    <Image style={{width:50, height:50, alignSelf:'center'}} source={require('../../assets/user-image.png')}/>
                </Marker>
            </MapView>
            <View
                style={styles.card}
                onPress={() => {}}
            >
                <Text style={styles.cardText}>Tracking user:</Text>
                <Text style={styles.cardText}>{props.route.params.user.id}</Text>
                <Text style={styles.cardText}>{props.route.params.user.name} {props.route.params.user.lastName}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff'
    },
    card: {
        position: 'absolute', 
        bottom: '10%', 
        backgroundColor: 'black',
        padding:10,
        elevation: 1,
        justifyContent: 'center',
        borderRadius: 5
    },
    cardText: {
        color: 'white',
        textAlign: 'center'
    },
    map: {
        height:'100%', 
        width:'100%'
    }
})