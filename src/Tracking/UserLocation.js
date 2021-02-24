import React from 'react';
import { Text } from 'react-native'

export default function UserLocation(props) {

    if (props) console.log(props.route.params)

    return (
        <Text>UserLocation</Text>
    )
}