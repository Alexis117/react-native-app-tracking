import React from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setContext } from 'apollo-link-context';

import Navigation from './src/Navigation'

const httpLink = new HttpLink({
  uri: 'http://192.168.1.70:5000/graphql'
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem("userToken")
  console.log(token)
  return {
    headers: {
      ...Headers,
      Authorization: token ? token: ""  
      }
  }
});

export const wsLink = new WebSocketLink({
  uri: `ws://192.168.1.70:5000/graphql`,
  options: {
    reconnect: true,
    connectionParams: async () => ({
      authToken: await AsyncStorage.getItem("userToken"),
    }),
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Navigation></Navigation>
    </ApolloProvider>
  );
}
