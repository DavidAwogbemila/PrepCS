import React from 'react';
import Demo_Problem from '../Problems/demo_problem';
import ProblemsComponent from '../Problems';
import DashboardComponent from '../Dashboard';
import HomeBar from '../Navigation';
import ProblemDetail from '../Problems/problem-detail';
import { SignInPage } from '../SignIn';
import { SignUpPage } from '../SignUp';
import { AuthUserContext, withAuthentication } from '../Session';
import { EventsPage } from '../Events';

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import './index.css';

import 'brace/mode/python';
import 'brace/theme/solarized_dark';

class HomePage extends React.Component {
	
  render() {
    return (
      <Router>
        <div className="homePage">
          <HomeBar authUser={this.props.authUser} />
          <Route path="/" exact render={(props) => <HomeBody {...props} authUser={this.props.authUser} />}></Route>
          <Route path="/signin" exact component={SignInPage}></Route>
          <Route path="/signup" exact component={SignUpPage}></Route>
          <Route path="/courses" exact component={ProblemsComponent}></Route>
          <Route path="/demo-problem" exact component={Demo_Problem}></Route>
          <Route path="/problem-detail/:problem_id" component={ProblemDetail}></Route>
          <Route path="/events" exact component={EventsPage}></Route>
          <Route path="/dashboard" exact component={DashboardComponent}></Route>
        </div>
      </Router>
    );
  }
}

class HomeBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: this.props }
    this.state = { width: '1920' };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
}

componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
}

componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
}

updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
}

  render() {
    var Is_Mid_Desktop = this.state.width < 1100;
    var Is_Mobile_View = this.state.width < 450;
    if (Is_Mobile_View == true){
      return (
        <div className="homeBody" style={{height: "100%", width: "100%"}}>
          <div className="jumbotron" style={{ marginTop: "5vh", marginBottom: "5vh", marginLeft: "5vw", marginRight: "5vw"}} >
            <h1 className="display-3">Welcome to PrepCS!</h1>
            <p className="lead">PrepCS is web service aimed at providing Computer Science students at Howard University a personalized career development platform on 3 major fronts:</p>
            <hr className="my-4"></hr>
            <div className="list-group">
              <a href="/dashboard" style={{ color: "white", backgroundColor: "#e51937" }} className="list-group-item list-group-item-action flex-column align-items-start">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">Personalized Dashboard</h5>
                </div>
                <p className="mb-1">Analyzes your statistics to accelerate your preparation.</p>
              </a>
              <a href="/courses" className="list-group-item list-group-item-action flex-column align-items-start">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">Coding Interview Readiness</h5>
                </div>
                <p className="mb-1">Prepares you for Technical and Behavioral Interviews.</p>
              </a>
              <a href="/events" className="list-group-item list-group-item-action flex-column align-items-start active">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">CS-Related Event Tracking</h5>
                </div>
                <p className="mb-1">Always be in the know to further your career goals.</p>
              </a>
            </div>
          </div>
          <div style={{marginTop: "55px", marginBottom: "55px", marginLeft: "9vw"}}>
            <a href="/signin"><button type="button" className="btn btn-warning" style={{paddingLeft: "40px", paddingRight: "40px", fontSize: "20px"}}>Sign In</button></a>
            <a href="/signup"><button type="button" className="btn btn-warning" style={{marginLeft: "7vw", paddingLeft: "40px", paddingRight: "40px", fontSize: "20px"}}>Sign Up</button></a>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="homeBody" style={{height: "100vh", width: "100vw"}}>
          <div className="jumbotron" style={{ marginTop: "5vh", marginBottom: "5vh", marginLeft: "5vw", marginRight: "5vw"}} >
            <h1 className="display-3">Welcome to PrepCS!</h1>
            <p className="lead">PrepCS is web service aimed at providing Computer Science students at Howard University a personalized career development platform on 3 major fronts:</p>
            <hr className="my-4"></hr>
            <div className="list-group">
              <a href="/dashboard" style={{ color: "white", backgroundColor: "#e51937" }} className="list-group-item list-group-item-action flex-column align-items-start">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">Personalized Dashboard</h5>
                </div>
                <p className="mb-1">Analyzes your statistics to accelerate your preparation.</p>
              </a>
              <a href="/courses" className="list-group-item list-group-item-action flex-column align-items-start">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">Coding Interview Readiness</h5>
                </div>
                <p className="mb-1">Prepares you for Technical and Behavioral Interviews.</p>
              </a>
              <a href="/events" className="list-group-item list-group-item-action flex-column align-items-start active">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">CS-Related Event Tracking</h5>
                </div>
                <p className="mb-1">Always be in the know to further your career goals.</p>
              </a>
            </div>
          </div>
          {!this.props.authUser &&
            <div style={Is_Mid_Desktop ? {marginTop: "55px", marginBottom: "55px", marginLeft: "27vw"} : {marginTop: "55px", marginBottom: "55px", marginLeft: "38vw"}} >
            <a href="/signin"><button type="button" className="btn btn-warning" style={Is_Mid_Desktop ? {paddingLeft: "40px", paddingRight: "40px", fontSize: "20px"} : {paddingLeft: "40px", paddingRight: "40px", fontSize: "20px"}}>Sign In</button></a>
            <a href="/signup"><button type="button" className="btn btn-warning" style={Is_Mid_Desktop ? {marginLeft: "15vw", paddingLeft: "40px", paddingRight: "40px", fontSize: "20px"} : {marginLeft: "15vw", paddingLeft: "40px", paddingRight: "40px", fontSize: "20px"}}>Sign Up</button></a>
          </div>}
        </div>
      );
    }
    
  }
}

class App extends React.Component {

  render() {
    return (
      <AuthUserContext.Consumer>
        {
          authUser => {
            return (<HomePage authUser={authUser} />);
          }
        }
      </AuthUserContext.Consumer>
    );
  }
}

export default withAuthentication(App);