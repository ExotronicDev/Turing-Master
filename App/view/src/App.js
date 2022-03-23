import React, {Component} from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

//Views
import Home from "./Views/Home";
import SignUp from './Views/SignUp';
import Login from './Views/Login';

class App extends Component {
  render(){
    return (
      <div className="App">
        <Router>
            <Routes>
              <Route exact path = "/" element = {<Home/>}></Route>
              <Route exact path = "/SignUp" element = {<SignUp/>}></Route>
              <Route exact path = "/Login/:user" element = {<Login/>}></Route>
            </Routes>
          </Router>
      </div>
    );
  }
}

export default App;
