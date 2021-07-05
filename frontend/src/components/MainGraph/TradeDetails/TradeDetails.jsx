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
query trades($wherea: BigInt! = 17168)
{
  trades(
    where: {dayTimestamp: $wherea}
  )
  {
    id
    amountGive
    amountGet
    tokenGive
    {
      id
    }
    tokenGet
    {
      id
    }
    getUser
    {
      id
    }
    giveUser
    {
      id
    }
  }
}

    

`

const QUERY2=gql`
query deposits($wherea: BigInt! = 17168)
{
deposits(
  where: {dayTimestamp: $wherea},
  ) {
    id
    user {
      id
    }
    amount
    balance
    token{
      id
    }
  }
}
`

function truncate(name)
{
  let returnName = name;
  let lenName = name.length;
  if (lenName > 8)
  {
    returnName = name[0]+name[1]+name[2]+name[3]+name[4]+"..."+name[lenName-3]+name[lenName-2]+name[lenName-1];
  }
  return returnName;
}

function TradesThatHappened({aaa}) {
  const { loading, error, data } = useQuery(QUERY, {variables: {wherea: {aaa}.aaa}});
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.trades.map(({ id, amountGive, amountGet, tokenGive, tokenGet, getUser,giveUser }) => (
    <div key={id}>
      <p>{"users: " + truncate(giveUser.id) + ' -> ' + truncate(getUser.id)}</p>
      <p>{"tokens: " + truncate(tokenGive.id) + ' -> ' + truncate(tokenGet.id)}</p>
      <p>{"amounts: " + amountGive +  '-> ' + amountGet}</p>
      <a href={"https://etherscan.io/tx/"+id+"#eventlog"}>link</a>
    </div>
  ));
}

function TradesThatHappened2({aaa}) {
  const { loading, error, data } = useQuery(QUERY2, {variables: {wherea: {aaa}.aaa}});
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return data.deposits.map(({ id , user, amount, balance, token}) => (
    <div key={id}>
      <p>{"user: " + truncate(user.id)}</p>
      <p>{"tokens " + truncate(token.id) }</p>
      <p>{"amount: " + amount}</p>
      <p>{"balance: " + balance}</p>
      <a href={"https://etherscan.io/tx/"+id+"#eventlog"}>link</a>
    </div>
  ));
}

const TradeDetails = ({ DaysFrom1970 , DateOffset, mode}) => (
  
    mode == 1? (
    <Grid container direction="row" alignItems="center">
    <ApolloProvider client={client}>
      <Grid item xs={12}>Trades that happened on {new Date((DaysFrom1970 + DateOffset)*24*60*60*1000).toLocaleDateString()}</Grid>
      <Grid item xs={12}>
      <TradesThatHappened
      aaa={DaysFrom1970 + DateOffset}
      ></TradesThatHappened>
      </Grid>
    </ApolloProvider>
  </Grid>
    ) :(
      <Grid container direction="row" alignItems="center">
      <ApolloProvider client={client}>
        <Grid item xs={12}>Deposits/Withdraws that happened on {DaysFrom1970 + DateOffset}</Grid>
        <Grid item xs={12}>
        <TradesThatHappened2
        aaa={DaysFrom1970 + DateOffset}
        ></TradesThatHappened2>
        </Grid>
      </ApolloProvider>
    </Grid>
    )
)

export default TradeDetails
