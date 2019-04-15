import React from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = BigCalendar.momentLocalizer(moment);
const allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

class EventsPageBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      sortedEvents: [],
      width: '1920',
      height: '1080'
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this._isMounted = false;
  }

  componentDidMount() {

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this._isMounted = true;
    let listOfEvents = [];

    
    this._isMounted === true && this.props.firebase.fs_events()
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const docData = doc.data();
          listOfEvents.push({
            title: docData.title,
            id: docData.id,
            start: new Date(docData.start.seconds * 1000),
            end: new Date(docData.end.seconds * 1000)
          });
        });
        this.setState({ events: listOfEvents });
      })
      .catch((error) => { console.warn(error) });
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  handleEventStatusChange = (checkbox) => {
    if (checkbox.checked) {
      // console.log("wasn't going. is going now.");
    } else {
      // console.log("was going. isn't going anymore.");
    }
  }


  render() {
    var Page_Height = this.state.height - 96;
    var Page_Width = this.state.width;
    var Card_Carousel_Height = (Page_Height * 2)/5;
    var Card_Height = (Page_Height * 3)/5;
    var Card_Width = Page_Width/2 - 10;
    var Card_Event_Width = Page_Width/4;
    var Card_Event_Height = (Card_Carousel_Height * 2)/3;

    Card_Carousel_Height = "" + Card_Carousel_Height + "px";
    Card_Height = "" + Card_Height + "px";
    Card_Width = "" + Card_Width + "px";

    Card_Event_Width = "" + Card_Event_Width + "px";
    Card_Event_Height = "" + Card_Event_Height + "px";

    return (
      <div style={{overflow: "hidden"}}>
        {/*<h2>Upcoming CS Events @ Howard University</h2>*/}
        <div className="Card_Carousel">
          <div className="card border-secondary mb-3" style={{ height: Card_Carousel_Height, marginBottom: "0px"}}>
              <div className="card-header" style={{backgroundColor: "#e51937"}}>
                <h4 style={{ color: "white", textAlign: 'center', marginBottom: "0px" }}>Current Events @ Howard University:</h4>
              </div>
              <div className="card-body" style={{whiteSpace: "nowrap", overflowX: "scroll"}}>

                <div className="card text-white bg-info mb-3" style={{display: "inline-block", width: Card_Event_Width, height: Card_Event_Height, marginBottom: "0px", marginRight: "20px"}}>
                  <div className="card-header">
                    <h4 style={{ color: "white", textAlign: 'center', marginBottom: "0px" }}>Event</h4>
                  </div>
                  <div className="card-body">

                  </div>
                </div>

                <div className="card text-white bg-warning mb-3" style={{display: "inline-block", width: Card_Event_Width, height: Card_Event_Height, marginBottom: "0px", marginRight: "20px"}}>
                  <div className="card-header">
                    <h4 style={{ color: "white", textAlign: 'center', marginBottom: "0px" }}>Event</h4>
                  </div>
                  <div className="card-body">

                  </div>
                </div>

                <div className="card text-white bg-success mb-3" style={{display: "inline-block", width: Card_Event_Width, height: Card_Event_Height, marginBottom: "0px", marginRight: "20px"}}>
                  <div className="card-header" >
                    <h4 style={{ color: "white", textAlign: 'center', marginBottom: "0px" }}>Event</h4>
                  </div>
                  <div className="card-body">

                  </div>
                </div>

                <div className="card text-white bg-danger mb-3" style={{display: "inline-block", width: Card_Event_Width, height: Card_Event_Height, marginBottom: "0px", marginRight: "20px"}}>
                  <div className="card-header" >
                    <h4 style={{ color: "white", textAlign: 'center', marginBottom: "0px" }}>Event</h4>
                  </div>
                  <div className="card-body">

                  </div>
                </div>

                <div className="card text-white bg-info mb-3" style={{display: "inline-block", width: Card_Event_Width, height: Card_Event_Height, marginBottom: "0px", marginRight: "20px"}}>
                  <div className="card-header" >
                    <h4 style={{ color: "white", textAlign: 'center', marginBottom: "0px" }}>Event</h4>
                  </div>
                  <div className="card-body">

                  </div>
                </div>

                <div className="card text-white bg-warning mb-3" style={{display: "inline-block", width: Card_Event_Width, height: Card_Event_Height, marginBottom: "0px", marginRight: "20px"}}>
                  <div className="card-header" >
                    <h4 style={{ color: "white", textAlign: 'center', marginBottom: "0px" }}>Event</h4>
                  </div>
                  <div className="card-body">

                  </div>
                </div>

                


              </div>
          </div>
        </div>
        <div className="Bottom" style={{margin: "3px auto"}}>
          <div className="Event_List" style={{float: "left", width: Card_Width}}>
            <div className="card border-success mb-3" style={{ height: Card_Height, marginBottom: "0px"}}>
                <div className="card-header" style={{backgroundColor: "#18BC9C"}}>
                  <h4 style={{ color: "white", textAlign: 'center', marginBottom: "0px" }}>Add List to Calender:</h4>
                </div>
                <div className="card-body">

                        <div style={{margin:10}}>
                          <Paper>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Event Title</TableCell>
                                  <TableCell>Event Start</TableCell>
                                  <TableCell>Event End</TableCell>
                                  <TableCell>Going?</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {
                                  this.state.events.map(
                                    event => (
                                      <TableRow key={event.id}>
                                        <TableCell><span>{event.title}</span></TableCell>
                                        <TableCell><span>{(new Date(event.start)).toString()}
                                          </span>
                                        </TableCell>
                                        <TableCell><span>{(new Date(event.end)).toString()}
                                          </span>
                                        </TableCell>
                                        <TableCell><span><input type="checkbox" onClick={this.handleEventStatusChange}></input></span></TableCell>
                                      </TableRow>
                                    )
                                  )
                                }
                              </TableBody>
                            </Table>
                          </Paper>
                        </div>

                  

                  


                </div>
            </div>
          </div>
          <div className="Event_Calender" style={{float: "right", width: Card_Width}}>
            <div className="card border-warning mb-3" style={{ height: Card_Height, marginBottom: "0px"}}>
                <div className="card-header" style={{backgroundColor: "#F39C12"}}>
                  <h4 style={{ color: "white", textAlign: 'center', marginBottom: "0px" }}>Calender:</h4>
                </div>
                <div className="card-body">

                <div style={{ height: 400 }}>
                  <BigCalendar
                    events={this.state.events}
                    views={allViews}
                    step={60}
                    showMultiDayTimes
                    defaultDate={new Date(2019, 3, 1)}
                    localizer={localizer}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={(event) => { console.log(event.id + " has been clicked") }}
                  />
                </div>


                </div>
            </div>
          </div>

        </div>
        

        {/*<div style={{margin:10}}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event Title</TableCell>
                  <TableCell>Event Start</TableCell>
                  <TableCell>Event End</TableCell>
                  <TableCell>Going?</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  this.state.events.map(
                    event => (
                      <TableRow key={event.id}>
                        <TableCell><span>{event.title}</span></TableCell>
                        <TableCell><span>{(new Date(event.start)).toString()}
                          </span>
                        </TableCell>
                        <TableCell><span>{(new Date(event.end)).toString()}
                          </span>
                        </TableCell>
                        <TableCell><span><input type="checkbox" onClick={this.handleEventStatusChange}></input></span></TableCell>
                      </TableRow>
                    )
                  )
                }
              </TableBody>
            </Table>
          </Paper>
        </div>
        <div style={{ height: 400 }}>
          <BigCalendar
            events={this.state.events}
            views={allViews}
            step={60}
            showMultiDayTimes
            defaultDate={new Date(2019, 3, 1)}
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={(event) => { console.log(event.id + " has been clicked") }}
          />
              </div>*/}
      </div>
    )
  }
}

const EventsPage = compose(
  withRouter,
  withFirebase
)(EventsPageBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(EventsPage);

