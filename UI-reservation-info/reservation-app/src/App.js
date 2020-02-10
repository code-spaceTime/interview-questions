import React, { Component } from 'react';
import './App.css';
import data from './data/data.json';
//import tables from './components/tables'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      result: [],
      filterData: [],
      priceBreak: false,
      totalPrice: 0,
      dateValue: null,
      tempData: []
    }
    this.onRowClick = this.onRowClick.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }
  onDateChange(e) {
    const dt = e.target.value.split('-');

    const filterDate = dt[1] + '-' + dt[2] + '-' + dt[0];

    debugger;
    let { tempData } = this.state;
    let result = [...tempData ];
    result = result.filter(i => i.startDate == filterDate.trim());
    this.setState({
      result: result
    }, () => {
      console.log(this.state.result)
    })
    debugger;
  }
  componentDidMount() {
    let result = data.map((val) => {
      let name = val.guestInfo.find(i => i.type == 'Primary').name;
      let roomName = val.roomDetails.Name;

      let totalPrice = 0;
      val.price.perDay.forEach(e => {
        let perDayTotal = e.RoomPrice + e.RoomTax + e.RoomFees;
        totalPrice = totalPrice + perDayTotal
      });
      let amts = '';
      val.amenities.forEach(a => {
        amts = amts + a.name + ','
      })
      amts = amts.substring(0, amts.length - 1);
      return { name: name, roomName: roomName, startDate: val.startDate, endDate: val.endDate, totalPrice: totalPrice, amts: amts }
    })
    this.setState({
      result: result,
      tempData: result
    })

  }
  onRowClick(name, totalPrice) {

    const filterData = data.filter(i => i.guestInfo.filter(j => j.type == 'Primary')[0].name == name)[0].price;

    let state = this.state;
    state.filterData = filterData;
    state.totalPrice = totalPrice;
    state.priceBreak = true;
    this.setState(state, () => {
      console.log(this.state)
    });

  }

  render() {



    return (

      <div className="App">
        <h1>Hotel Reservation</h1>
        <div className="filter">
          Booking date filter: <input onChange={(e) => this.onDateChange(e)} type="date" value={this.state.dateValue}></input></div>

        <table className="tableStyle">
          <thead className="tableHead" >
            <th>Primary Guest</th>
            <th>Room Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total Price</th>
            <th>Amenity Names</th>
          </thead>
          <tbody>
            {
              this.state.result.map((row) =>
                <tr>
                  <td>{row.name}</td>
                  <td>{row.roomName}</td>
                  <td>{row.startDate}</td>
                  <td>{row.endDate}</td>
                  <td><a href="#" onClick={() => this.onRowClick(row.name, row.totalPrice)}>{row.totalPrice}</a></td>
                  <td>{row.amts}</td>
                </tr>
              )
            }
          </tbody>
        </table>
        <div>
          {
            this.state.priceBreak && this.state.filterData &&
            <div className='priceBreakup'>
              <h2>Price break up</h2>
              <div>
                {
                  this.state.filterData.perDay.map((pr, index) =>
                    <div>
                      <label>Day: {index + 1}</label>
                      <br />
                      <label>Room price: {pr.RoomPrice}</label>
                      <br />
                      <label>Room Tax: {pr.RoomTax}</label>
                      <br />
                      <label>Room Fees: {pr.RoomFees}</label>
                      <br />
                    </div>
                  )
                }

              </div>
              <label>Total price: {this.state.totalPrice}</label>
            </div>
          }
        </div>
      </div>
    );
  }
}

