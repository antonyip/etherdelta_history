import React, { Component, useState } from 'react'
import ApolloClient, { gql, InMemoryCache } from 'apollo-boost'
import { ApolloProvider, Query, withApollo } from 'react-apollo'
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

const GRAVATARS_QUERY = gql` 
{
  activities(id: "17048") {
    id
  }
}
`

const TradeDetails = ({  }) => (
  <Grid container direction="row" alignItems="center">
    <ApolloProvider client={client}>
        <Query
      query={GRAVATARS_QUERY}
        variables={{
          WhatIWant: 5,
          where: {
            ...( true ? { WhatIWant: '5'} : {}),
          },
        }}
      >
        {({ data, error, loading }) => {
          let dataArrTradesX = [];
          let dataArrTradesY = [];
          let dataArrTrades = [];
          let dataArrTradesOptions = [];

          if (!loading && !error)
          {
            // dataArrTradesX = data.activity.map((d)=>{
            //   return 1
            // })
          }

          return loading ? (
            <LinearProgress variant="query" style={{ width: '100%' }} />
          ) : error ? (
            <Grid container> {error} </Grid>
          ) : (
            <Grid container>
              <Grid item>
                <Typography>
                  {dataArrTradesX.join('\n')}
                </Typography>
              </Grid>
            </Grid>
          )
        }}
      </Query>
      </ApolloProvider>
  </Grid>
)

export default TradeDetails
