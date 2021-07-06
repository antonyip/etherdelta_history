import React, { Component, useState } from 'react'
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
  Button,
} from '@material-ui/core'
import './App.css'
import Header from './components/Header'
import MainGraph from './components/MainGraph'
import Filter from './components/Filter'

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
      mode: 1,
    }
  }

  toggleHelpDialog = () => {
    this.setState(state => ({ ...state, showHelpDialog: !state.showHelpDialog }))
  }

  gotoQuickStartGuide = () => {
    window.location.href = 'https://thegraph.com/docs/quick-start'
  }

  render() {
    let { withImage, withName, orderBy, showHelpDialog, dateChange, DaysFrom1970, mode } = this.state

    return (
      <Grid container>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
        <Header onHelp={this.toggleHelpDialog} />
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
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
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={12}>
          <MainGraph
          DaysFrom1970={DaysFrom1970}
          mode = {1}
          ></MainGraph>
          <MainGraph
          DaysFrom1970={DaysFrom1970}
          mode = {2}
          ></MainGraph>
      </Grid>
      </Grid>
    )
  }
}

export default App
