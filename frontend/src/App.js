import React, { Component, useState } from 'react'
import ApolloClient, { gql, InMemoryCache } from 'apollo-boost'
import { ApolloProvider, Query, withApollo } from 'react-apollo'
import {
  Grid,
  LinearProgress,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogContentText,
  // DialogTitle,
  // Button,
  //Typography,
  TextField,
} from '@material-ui/core'
import { Line, Bar } from 'react-chartjs-2';
import './App.css'
import Header from './components/Header'
import TradeDetails from './components/TradeDetails'
import TradeDetails2 from './components/TradeDetails2'
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
/*
query GetDogs($WhatIWant: ID = 0) {
    user(id: $WhatIWant) {
      id
    }
  }
}
query GetDogs($WhatIWant: Int = 5) {
    users(first: $WhatIWant) {
      id
  }
}
query GetDogs($DateStart: Int =0, $DateEnd: Int =2) {
  activities(first:500 skip:1 where: {id_gt:$DateStart, id_lt:$DateEnd} ) {
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
*/


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
      <ApolloProvider client={client}>
        <div className="App">
          <Grid container direction="column">
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
                DaysFrom1970 = new Date(field).getTime()/60/60/24/1000
                console.log(DaysFrom1970);
              }}
            />
            <Grid item>
              <Grid container>
                <Query
                  query={GRAVATARS_QUERY2}
                  variables={{
                    where: {
                      ...(true ? {dayTimestamp_gt: 0} : {})
                      //...(withImage ? { id_gt: '0' } : {}),
                      //...(withName ? { displayName_not: '' } : {}),
                    },
                    orderBy: orderBy,
                  }}
                >
                  {({ data, error, loading }) => {
                    let dataArrOrders = [];
                    let dataArrCancels = [];
                    let dataArrTrades = [];
                    let dataArrDepositsAndWithdraws = [];
                    let dataArrOrdersX = [];
                    let dataArrOrdersY = [];
                    let dataArrOptions = [];
                    let dataArrCancelsY = [];
                    let dataArrTradesY = [];
                    let dataArrDepositsY = [];
                    let dataArrWithdrawsY = [];
                    let dataArrOrdersSumY = [] ;
                    let dataArrTradesSumY = [] ;
                 
                  //   const  getElementsAtEvent = elements => {
                  //     if (!elements.length) return;
                  // //console.log("3")
                  //     setClickedElements(elements.length);
                  //   };

                    let getElementAtEvent = element => {
                      if (!element.length) return;
                      const { datasetIndex, index } = element[0];
                      this.UpdateTop(datasetIndex, index);
                      
                      // setClickedElement(
                      //   `${data.labels[index]} - ${data.datasets[datasetIndex].data[index]}`
                      // );
                    }
                    
                    let getDatasetAtEvent = dataset => {
                      if (!dataset.length) return;
                      const datasetIndex = dataset[0].datasetIndex;
                      //this.UpdateTop(null, dataset[0].datasetIndex);
                      // setClickedDataset(data.datasets[datasetIndex].label);
                    }

                    if (!loading && !error)
                    {
                      //console.log("hello world2");
                      let CountTotalOrders = 0;
                      // let CountTotalCancel = 0;
                      let CountTotalTrade = 0;
                      let prevValue = 0;
                      // let CountTotalDeposits = 0;
                      // let CountTotalWithdraws = 0;
                      // TotalOrderCount
                      // TotalCancelCount
                      // TotalTradeCount
                      // TotalDeposits
                      // TotalWithdraws
                      
                      dataArrOrdersX = data.activities.map((d)=> {
                        return new Date(parseInt(d.id)*60*60*24*1000).toDateString();
                      });
                      dataArrOrdersY = data.activities.map((d)=> {
                        return d.TotalOrderCount;
                      });
                      dataArrOrdersSumY = data.activities.map((d)=> {
                        CountTotalOrders = parseInt(prevValue) + parseInt(d.TotalOrderCount);
                        prevValue = d.TotalOrderCount
                        return CountTotalOrders;
                      });
                      dataArrCancelsY = data.activities.map((d)=> {
                        return d.TotalCancelCount;
                      });
                      dataArrTradesY = data.activities.map((d)=> {
                        return d.TotalTradeCount;
                      });
                      dataArrTradesSumY = data.activities.map((d)=> {
                        CountTotalTrade = parseInt(prevValue) + parseInt(d.TotalTradeCount);
                        prevValue = CountTotalTrade
                        return CountTotalTrade;
                      });
                      dataArrDepositsY = data.activities.map((d)=> {
                        return d.TotalDeposits;
                      });
                      dataArrWithdrawsY = data.activities.map((d)=> {
                        return d.TotalWithdraws;
                      });
                      dataArrTrades = {
                        labels: dataArrOrdersX,
                        datasets: [
                          {
                            type: "line",
                            label: '# of Trades',
                            data: dataArrTradesSumY,
                            fill: false,
                            backgroundColor: 'green',
                            borderColor: 'rgba(255, 99, 132, 0.2)',
                            yAxisID: 'y-axis-2',
                          },
                          {
                            type: "bar",
                            label: '# of Trades Per Day',
                            data: dataArrTradesY,
                            fill: false,
                            backgroundColor: 'rgba(50, 50, 50, 0.3)',
                            borderColor: 'rgba(255, 99, 132, 0.2)',
                            yAxisID: 'y-axis-1',
                          },
                        ],
                      };
                      dataArrOrders = {
                        labels: dataArrOrdersX,
                        datasets: [
                          {
                            label: '# of Orders Per Day',
                            data: dataArrOrdersY,
                            fill: false,
                            backgroundColor: 'black',
                            borderColor: 'rgba(255, 99, 132, 0.2)',
                          },
                        ],
                      };
                      dataArrDepositsAndWithdraws = {
                        labels: dataArrOrdersX,
                        datasets: [
                        {
                            label: '# of Deposits Per Day',
                            data: dataArrDepositsY,
                            fill: false,
                            backgroundColor: 'blue',
                            borderColor: 'rgba(255, 99, 132, 0.2)',
                          },                          {
                            label: '# of Withdraws Per Day',
                            data: dataArrWithdrawsY,
                            fill: false,
                            backgroundColor: 'orange',
                            borderColor: 'rgba(255, 99, 132, 0.2)',
                          },
                        ],
                      };
                      dataArrOptions = {
                        scales: {
                          yAxes: [
                            {
                              id: 'y-axis-1',
                              ticks: {
                                beginAtZero: false,
                              },
                              position: 'left',
                            },
                            {
                              id: 'y-axis-2',
                              ticks: {
                                beginAtZero: false,
                              },
                              gridLines: {
                                drawOnArea: false,
                              },
                              position: 'right',
                            },
                          ],
                        },
                      };
                    }

                    return loading ? (
                      <LinearProgress variant="query" style={{ width: '100%' }} />
                    ) : error ? (
                      <Error error={error} />
                    ) : (
                      <Grid container>
                        <Grid container>
                          <Grid item xs={6}>
                            <Bar width={1000} height={400} data={dataArrTrades} options={dataArrOptions}
                              getDatasetAtEvent={getDatasetAtEvent}
                              getElementAtEvent={getElementAtEvent}
                              // getElementsAtEvent={getElementsAtEvent}
                            ></Bar>
                          </Grid>
                          
                          <Grid item xs={6}>Click on a spot on the chart to see more details!  
                          <TradeDetails></TradeDetails>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item xs={6}>
                            <Line width={1000} height={400} data={dataArrDepositsAndWithdraws} options={dataArrOptions} ></Line>
                          </Grid>
                          <Grid item xs={6}>Click on a spot on the chart to see more details!
                          <TradeDetails2></TradeDetails2>
                          </Grid>
                        </Grid>
                      </Grid>
                    )
                  }}
                </Query>

                

              </Grid>
            </Grid>
          </Grid>
        </div>
      </ApolloProvider>
      </Grid>
    )
  }
}

export default App
