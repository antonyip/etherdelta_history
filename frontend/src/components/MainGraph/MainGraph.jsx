import React, { Component, useState } from 'react'
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
import { Line, Bar } from 'react-chartjs-2';
import TradeDetails from './TradeDetails';

if (!process.env.REACT_APP_GRAPHQL_ENDPOINT) {
  throw new Error('REACT_APP_GRAPHQL_ENDPOINT environment variable not defined')
}

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
})

const QUERY=gql`
query activities($wherea: BigInt! = 17167) {
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

let dataArrOrders = [];
let dataArrCancels = [];
let dataArrTrades = [];
let dataArrOrdersY = [];
let dataArrOrdersX = [];
let dataArrDepositsY = [];
let dataArrWithdrawsY = [];
let dataArrDepositsAndWithdraws = [];

let dataArrOptions = [];
let dataArrCancelsY = [];
let dataArrTradesY = [];

let dataArrOrdersSumY = [] ;
let dataArrTradesSumY = [] ;

let dateOffset = 0;

function MainGraphQuery({aaa, onDateChange}) {
  const { loading, error, data } = useQuery(QUERY, {variables: {wherea: {aaa}.aaa}});

//   const  getElementsAtEvent = elements => {
//     if (!elements.length) return;
// //console.log("3")
//     setClickedElements(elements.length);
//   };

  let getElementAtEvent = element => {
    if (!element.length) return;
    const { datasetIndex, index } = element[0];
    //this.UpdateTop(datasetIndex, index);
    dateOffset = index;
    console.log(datasetIndex, index);
    onDateChange(index);
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

  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message}</p>;

  return <Grid><Line width={1000} height={400} data={dataArrTrades} options={dataArrOptions}
  getElementAtEvent={getElementAtEvent}
  ></Line></Grid>;
}

function MainGraphQuery2({aaa}) {
  const { loading, error, data } = useQuery(QUERY, {variables: {wherea: {aaa}.aaa}});

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

  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message}</p>;

  return <Grid>
  <Line width={1000} height={400} data={dataArrDepositsAndWithdraws} options={dataArrOptions}></Line>
  </Grid>
  ;
}

class MainGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateOffset: 0,
      DaysFrom1970: 17167,
      mode: props.mode,
    };
  }



  render() {
    let { dateOffset } = this.state

    return (
            <Grid container direction="row">
              { this.state.mode == 1 ? (
                <ApolloProvider client={client}>
                  <Grid item xs={2}></Grid>
                <Grid item xs={8}>
                <MainGraphQuery
                  aaa={this.state.DaysFrom1970}
                  onDateChange={(field) => { this.setState(state => ({...state, dateOffset: field})); console.log("onDateChange" + dateOffset)}}
                  ></MainGraphQuery>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={12}>
                  <TradeDetails
                  DaysFrom1970={this.state.DaysFrom1970}
                  DateOffset={dateOffset}
                  mode={this.state.mode}
                  ></TradeDetails>
                  </Grid>
                </ApolloProvider>
              ) : (
                <ApolloProvider client={client}>
                <Grid item xs={6}>
                  <MainGraphQuery2
                  aaa={this.state.DaysFrom1970}
                  ></MainGraphQuery2>
                  </Grid>
                  <Grid item xs={6}>
                  <TradeDetails
                  DaysFrom1970={this.state.DaysFrom1970}
                  DateOffset={this.state.dateOffset}
                  mode={this.state.mode}
                  ></TradeDetails>
                  </Grid>
                </ApolloProvider>
              )};
            </Grid>
          );
    }
  }
export default MainGraph