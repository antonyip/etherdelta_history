import React, { Component, useState } from 'react'
//import ApolloClient, { InMemoryCache, gql, useQuery} from 'apollo-boost'
//import { ApolloProvider, Query, withApollo } from 'react-apollo'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  useApolloClient
} from "@apollo/client";
import { Query, Mutation, Subscription } from '@apollo/client/react/components';
import { graphql } from '@apollo/client/react/hoc';
import {
  Grid,
  LinearProgress,
  TextField,
  Typography,
  IconButton,
} from '@material-ui/core'

if (!process.env.REACT_APP_GRAPHQL_ENDPOINT) {
  throw new Error('REACT_APP_GRAPHQL_ENDPOINT environment variable not defined')
}

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
})

// client
//   .query({
//     query: gql`
//     {
//       activities(id: "17048") {
//         id
//       }
//     }
//     `
//   })
//   .then(result => {console.log("1");console.log(result);console.log("2");});

const QUERY=gql`
{
  activities(id: "17048") {
    id
  }
}
`

function ExchangeRates() {
  const { loading, error, data } = useQuery(QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.activities.map(({ id }) => (
    <div key={id}>
      <p>
        {id}: {id}
      </p>
    </div>
  ));
}

const TradeDetails = ({  }) => (
  <Grid container direction="row" alignItems="center">
    <ApolloProvider client={client}>
      <ExchangeRates></ExchangeRates>
    </ApolloProvider>
  </Grid>
)

export default TradeDetails
