import React, { Component, useState} from 'react'
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

const QUERY=gql`
query trades($wherea: BigInt! = 17167)
{
  trades(
    where: {dayTimestamp: $wherea},
  ) {
    id
  }
}
`

function TradesThatHappened({aaa}) {
  const { loading, error, data } = useQuery(QUERY, {variables: {wherea: {aaa}.aaa}});
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.trades.map(({ id }) => (
    <div key={id}>
      <a href="https://etherscan.io/tx/{{id}}#eventlog">
      https://etherscan.io/tx/{id}#eventlog
      </a>
    </div>
  ));
}

const TradeDetails = ({ DaysFrom1970 }) => (
  <Grid container direction="row" alignItems="center">
    <ApolloProvider client={client}>
      Trades that happened on {DaysFrom1970}
      <TradesThatHappened
      aaa={DaysFrom1970}
      ></TradesThatHappened>
    </ApolloProvider>
  </Grid>
)

export default TradeDetails
