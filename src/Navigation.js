import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, gql } from '@apollo/client'

import { Text } from 'react-native';

import Login from './Auth/Login';
import SignUp from './Auth/SignUp';
import Home from './Home/Home';
import Test from '../Test';

export const AuthContext = createContext();

const AuthStack = createStackNavigator();

const Tab = createBottomTabNavigator();

const LOGIN = gql`
mutation login($password: String!, $email: String!){
    login(password: $password, email: $email) {
        token
        success
        message
    }
}
`

const SIGNUP = gql`
mutation signUp($password: String!, $email: String!, $name: String!, $lastName: String!){
    login(password: $password, email: $email, name: $name, lastName: $lastName) {
        token
        success
    }
}
`

export default function Navigation() {
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
                dispatch({ type: 'SIGN_IN', token: res.data.login.token });
            } else
                return res;
          },
          signOut: async () => {
            await AsyncStorage.removeItem('userToken');
            dispatch({ type: 'SIGN_OUT' });
          },
          signUp: async data => {
            const res = await signUp({variables:{email:data.email, password:data.password, name:data.name, lastName:data.lastName}});
            console.log(res)
            if (res.data)
                dispatch({ type: 'SIGN_IN', token: res.data.signUp.token });
            else
                return res;
          },
        }),
        []
      );

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                {
                    state.userToken == null ? (
                        <AuthStack.Navigator>
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
                        <Tab.Navigator>
                            <Tab.Screen name="Home" component={Home} />
                            <Tab.Screen name="Pedidos" component={Test} />
                        </Tab.Navigator>
                    )
                }
            </NavigationContainer>
        </AuthContext.Provider>
    )
  }