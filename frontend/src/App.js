import React, { Component, useState } from 'react'
//import ApolloClient, { gql, InMemoryCache } from 'apollo-boost'
import { Query, Mutation, Subscription } from '@apollo/client/react/components';
import { graphql } from '@apollo/client/react/hoc';
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
} from '@material-ui/core'
import { Line, Bar } from 'react-chartjs-2';
import './App.css'
import Header from './components/Header'
import MainGraph from './components/MainGraph'
import TradeDetails from './components/MainGraph/TradeDetails'
//import TradeDetails2 from './components/TradeDetails2'
import Error from './components/Error'
//import Gravatars from './components/Gravatars'
import Filter from './components/Filter'
if (!process.env.REACT_APP_GRAPHQL_ENDPOINT) {
  throw new Error('REACT_APP_GRAPHQL_ENDPOINT environment variable not defined')
}

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
})

//query gravatars($where: Gravatar_filter!, $orderBy: Gravatar_orderBy!) {
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

//where: $where,
//$where: String
const GRAVATARS_QUERY2bak = gql` 
query activities($timestamp: BigInt)
{
  activities(
  orderBy: "id",
  orderDirection: "asc",
  dayTimestamp_gt: $timestamp
  first: 90)
  {
    id
    TotalOrderCount
    TotalCancelCount
    NetOrderCount
    TotalDeposits
    TotalWithdraws
    NetDeposits
    TotalTradeCount
  }
}
`
//where: {dayTimestamp_gt: $timestamp},
//where: $timestamp,
const GRAVATARS_QUERY2 = gql`
query activities($wherea: BigInt! = 17000) {
  activities(
  orderBy: id,
  orderDirection: asc,
  where: {dayTimestamp_gt: $wherea},
  first: 90)
  {
    id
    TotalOrderCount
    TotalCancelCount
    NetOrderCount
    TotalDeposits
    TotalWithdraws
    NetDeposits
    TotalTradeCount
    dayTimestamp
  }
}
`

//query gravatars($where: activities_filter!, $orderBy: activities_orderBy!) {
const GRAVATARS_QUERY3 = gql` 
query GetDogs($WhatIWant: Int) {
    users(first: $WhatIWant) {
      id
  }
}
`

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      withImage: false,
      withName: false,
      orderBy: 'displayName',
      showHelpDialog: false,
      Var1: 0,
      startDate: 17167, // days since epoch (17167 = 2017-jan-01)
    }
  }

  toggleHelpDialog = () => {
    this.setState(state => ({ ...state, showHelpDialog: !state.showHelpDialog }))
  }

  gotoQuickStartGuide = () => {
    window.location.href = 'https://thegraph.com/docs/quick-start'
  }

  UpdateTop = (a,b) => {
    console.log("datasetIndex", a);
    console.log("index", b);
  }

  UpdateBottom = (a,b) => {
    console.log("datasetIndex", a);
    console.log("index", b);
  }

  render() {
    let { withImage, withName, orderBy, showHelpDialog, dateChange, DaysFrom1970 } = this.state

    return (
      <Grid>
        <Header onHelp={this.toggleHelpDialog} />
        <Filter
              orderBy={orderBy}
              withImage={withImage}
              withName={withName}
              dateChange={dateChange}
              onOrderBy={field => this.setState(state => ({ ...state, orderBy: field }))}
              onToggleWithImage={() =>
                this.setState(state => ({ ...state, withImage: !state.withImage }))
              }
              onToggleWithName={() =>
                this.setState(state => ({ ...state, withName: !state.withName }))
              }
              onDateChange={field => {
                this.setState(state => ({...state, dateChange: field}));
                let tmpDaysFrom1970 = new Date(field).getTime()/60/60/24/1000;
                this.setState(state => ({...state, DaysFrom1970: tmpDaysFrom1970}));
                console.log(DaysFrom1970);
              }}
        />
      <MainGraph
      DaysFrom1970={DaysFrom1970}
      mode = {1}
      ></MainGraph>
      <MainGraph
      DaysFrom1970={DaysFrom1970}
      mode = {2}
      ></MainGraph>
      </Grid>
    )
  }
}

export default App
