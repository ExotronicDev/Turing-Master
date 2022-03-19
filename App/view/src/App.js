import React, {Component} from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

//Views
import Home from "./Views/Home";

class App extends Component {
  render(){
    return (
      <div className="App">
        <Router>
            <Routes>
              <Route exact path = "/" element = {<Home/>}></Route>
            </Routes>
          </Router>
      </div>
    );
  }
}

export default App;
