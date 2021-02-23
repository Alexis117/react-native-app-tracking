import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useMutation, gql } from '@apollo/client'
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Permissions from 'expo-permissions';

const UPDATE_LOCATION = gql`
mutation updateLocation($latitude:String, $longitude:String) {
    updateLocation(latitude: $latitude, longitude: $longitude) {
        success
    }
}
`

export default function MyLocation() {
    const [location, setLocation] = useState(null);
    const [latitudeDelta, setLatitudeDelta] = useState(0.0922);
    const [longitudeDelta, setLongitudeDelta] = useState(0.0421);
    const [isLocationActive, setIsLocationActive] = useState(false);

    const [ updateLocation ] = useMutation(UPDATE_LOCATION)

    useEffect(() => {
        (async () => {
          const { status } = await Permissions.askAsync(Permissions.LOCATION);
          if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
          }
    
          let loc = await Location.getCurrentPositionAsync({});
          setLocation(loc);
          const options = {
              accuracy: 4,
              distanceInterval: 1
          }

          const isLocationActive = await Location.hasStartedLocationUpdatesAsync('LOCATION_SHARE_TASK')
          setIsLocationActive (isLocationActive)
          
          //Looks for position only when apps is in use
          //Location.watchPositionAsync(options, response => setLocation(response))
        })();
    }, []);

    TaskManager.defineTask('LOCATION_SHARE_TASK', ({ data: { locations }, error }) => {
        if (error) {
            console.log(error)
            return;
        }
        console.log('Received new locations', locations);
        updateLocation({variables:{latitude: locations[0].coords.latitude, longitude: locations[0].coords.longitude}}).then(
            res => console.log('')
        ).catch(
            err => console.log(err)
        )
        
    });

    async function startSharingLocation() {
        const options = {
            accuracy: 4,
            distanceInterval: 1,
            showsBackgroundLocationIndicator: true,
            foregroundService: {
                notificationTitle: 'Sharing your location',
                notificationBody: 'Your location is being shared with users in app',
                notificationColor: '#3273dc'
            }
        }

        await Location.startLocationUpdatesAsync('LOCATION_SHARE_TASK', options)
        setIsLocationActive(true)
    }

    async function stopSharingLocation() {
        await Location.stopLocationUpdatesAsync('LOCATION_SHARE_TASK')
        setIsLocationActive(false)
    }

    if (location)
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    //showsUserLocation= {true}
                    //followsUserLocation={true}
                    region={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: latitudeDelta,
                        longitudeDelta: longitudeDelta,
                    }}
                    onRegionChangeComplete={region => {
                        setLatitudeDelta(region.latitudeDelta)
                        setLongitudeDelta(region.longitudeDelta)
                    }}
                >
                    <Marker
                        coordinate={{latitude: location.coords.latitude, longitude: location.coords.longitude}}
                    >
                        <Image style={{width:50, height:50, alignSelf:'center'}} source={require('../../assets/user-image.png')}/>
                    </Marker>
                </MapView>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => isLocationActive ? stopSharingLocation() : startSharingLocation()}
                >
                    <Text style={styles.buttonText}>{isLocationActive ? 'Stop sharing your Location' : 'Share your location with others'}</Text>
                </TouchableOpacity>
            </View>
        )
    return (
        <View style={styles.container}>
            <Text>Loading...</Text>
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
    button: {
        position: 'absolute', 
        bottom: '10%', 
        backgroundColor: '#3273dc',
        height: 40,
        width: 250, 
        elevation: 1,
        justifyContent: 'center',
        borderRadius: 5
    },
    buttonText: {
        color: 'white',
        textAlign: 'center'
    },
    map: {
        height:'100%', 
        width:'100%'
    }
})
