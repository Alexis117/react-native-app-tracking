import React, { createContext, useReducer, useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, gql } from '@apollo/client'
import { FontAwesome5 } from '@expo/vector-icons'; 

import { Text } from 'react-native';

import Auth from './Auth/Auth'
import Login from './Auth/Login';
import SignUp from './Auth/SignUp';
import Home from './Home/Home';
import Test from '../Test';
import MyLocation from './Tracking/MyLocation'
import UserLocation from './Tracking/UserLocation'

import { wsLink } from '../App'

export const AuthContext = createContext();

const AuthStack = createStackNavigator();

const Tab = createBottomTabNavigator();

const HomeStack = createStackNavigator();

const LOGIN = gql`
mutation login($password: String!, $email: String!){
    login(password: $password, email: $email) {
        token
        success
        message
        user {
          name
          lastName
          email
        }
    }
}
`

const SIGNUP = gql`
mutation signUp($password: String!, $email: String!, $name: String!, $lastName: String!){
    signUp(password: $password, email: $email, name: $name, lastName: $lastName) {
        token
        success
        user{
          name
          lastName
          email
        }
    }
}
`

export default function Navigation() {
    const [userInfo, setUserInfo] = useState({})
    const [state, dispatch] = useReducer(
        (prevState, action) => {
          switch (action.type) {
            case 'RESTORE_TOKEN':
              return {
                ...prevState,
                userToken: action.token,
                isLoading: false,
              };
            case 'SIGN_IN':
              return {
                ...prevState,
                isSignout: false,
                userToken: action.token,
              };
            case 'SIGN_OUT':
              return {
                ...prevState,
                isSignout: true,
                userToken: null,
              };
          }
        },
        {
          isLoading: true,
          isSignout: false,
          userToken: null,
        }
    );
    const [login] = useMutation(LOGIN);
    const [signUp] = useMutation(SIGNUP);


    useEffect(() => {
        const getToken = async () => {
          let userToken;
          try {
            userToken = await AsyncStorage.getItem('userToken');
          } catch (e) {
            console.log(e);
          }
          dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        };
    
        getToken();
    }, []);

    const authContext = useMemo(
        () => ({
          signIn: async data => {
            const res = await login({variables:{email:data.email, password:data.password}});
            if (res.data.login.success){
                await AsyncStorage.setItem('userToken', res.data.login.token);
                wsLink.subscriptionClient.tryReconnect(); //Restarting ws connection for authentication purposes
                dispatch({ type: 'SIGN_IN', token: res.data.login.token });
                setUserInfo({name: res.data.login.user.name, lastName: res.data.login.user.lastName, email: res.data.login.user.email})
            } else
                return res;
          },
          signOut: async () => {
            await AsyncStorage.removeItem('userToken');
            dispatch({ type: 'SIGN_OUT' });
            setUserInfo({})
          },
          signUp: async data => {
            try {
              const res = await signUp({variables:{email:data.email, password:data.password, name:data.name, lastName:data.lastName}});
              await AsyncStorage.setItem('userToken', res.data.signUp.token);
              wsLink.subscriptionClient.tryReconnect(); //Restarting ws connection for authentication purposes
              dispatch({ type: 'SIGN_IN', token: res.data.signUp.token });
              setUserInfo({name: res.data.signUp.name, lastName: res.data.signUp.lastName, email: res.data.signUp.email})
            } catch (err) {
              return err;
            }
          },
        }),
        []
      );

    function HomeStackNavigator() {
      return(
        <HomeStack.Navigator>
          <HomeStack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
          }}/>
          <HomeStack.Screen
            name="UserLocation"
            component={UserLocation}
            options={{
              headerShown: false,
          }}/>
        </HomeStack.Navigator>
      )
    }

    return (
        <AuthContext.Provider value={{authContext: authContext, userInfo: userInfo}}>
            <NavigationContainer>
                {
                    state.userToken == null ? (
                        <AuthStack.Navigator>
                          <AuthStack.Screen 
                            name="Auth"
                            component={Auth}
                            options={{
                                headerShown: false,
                            }}/>
                            <AuthStack.Screen 
                            name="Login"
                            component={Login}
                            options={{
                                headerShown: false,
                            }}/>
                            <AuthStack.Screen 
                            name="SignUp"
                            component={SignUp}
                            options={{
                                headerShown: false,
                            }}/>
                        </AuthStack.Navigator>
                    ) : (
                        <Tab.Navigator 
                          tabBarOptions={{keyboardHidesTabBar: true}}
                          screenOptions={({ route }) => ({
                            tabBarIcon: ({ focused, color, size }) => {
                              let iconName;
                              if (route.name === 'Home') {
                                iconName = 'home';
                              } else if (route.name === 'My Location') {
                                iconName = 'map-marker';
                              }
                              // You can return any component that you like here!
                              return <FontAwesome5 name={iconName} size={24} color={color} />;
                            },
                          })}
                          tabBarOptions={{
                            activeTintColor: 'black',
                            inactiveTintColor: 'gray',
                          }}
                          >
                            <Tab.Screen name="Home" component={HomeStackNavigator} />
                            <Tab.Screen name="My Location" component={MyLocation} />
                        </Tab.Navigator>
                    )
                }
            </NavigationContainer>
        </AuthContext.Provider>
    )
  }