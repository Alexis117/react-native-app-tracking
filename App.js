import React from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import Test from './Test'
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const httpLink = new HttpLink({
  uri: 'http://192.168.1.68:5000/graphql'
});

const wsLink = new WebSocketLink({
  uri: `ws://192.168.1.68:5000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiMmJiYjdjNTgtMzg0Ni00YTc2LWE2MTItZWE5ZDE3OGY1ZmMwIn0.tX2DW3XnYVPfxIy9KYnC6YAAqqXS1_H49V4rbO8Fr8g',
    },
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
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Test></Test>
    </ApolloProvider>
  );
}
