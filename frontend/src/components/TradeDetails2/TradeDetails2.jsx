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

import { Line, Bar } from 'react-chartjs-2';

if (!process.env.REACT_APP_GRAPHQL_ENDPOINT) {
  throw new Error('REACT_APP_GRAPHQL_ENDPOINT environment variable not defined')
}

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
})

const GRAVATARS_QUERY = gql` 
{
  tokenActivities(first: 5) {
    id
    tradeCount
    withdrawCount
    depositCount
    orderCount
    cancelCount
  }
}
`

const TradeDetails2 = ({  }) => (
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
            let counter = 0;
            dataArrTradesX = data.tokenActivities.map((d)=> {
              return d.id;
            });
            dataArrTradesY = data.tokenActivities.map((d)=> {
              return ++counter;
            });
            dataArrTrades = {
              labels: dataArrTradesX,
              datasets: [
                {
                  label: '# of Trades Per Day',
                  data: dataArrTradesY,
                  fill: false,
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgba(255, 99, 132, 0.2)',
                },
              ],
            };
            dataArrTradesOptions = {
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: false,
                    },
                  },
                ],
              },
            };
          }

          return loading ? (
            <LinearProgress variant="query" style={{ width: '100%' }} />
          ) : error ? (
            <TextField> {error} </TextField>
          ) : (
            <Grid container>
              <Grid item>
                {/* <Line width={1000} height={400} data={dataArrTrades} options={dataArrTradesOptions}></Line> */}
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

export default TradeDetails2
