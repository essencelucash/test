import React, { Component } from 'react';
import logo from './Olive3.png';
import ReadSheet from '../Readsheet/Readsheet';
import SheetsAPI from '../../utility/SheetsApi'
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    console.log(SheetsAPI.GoogleAuth);
    //test
    //var GoogleSpreadsheets = require('google-spreadsheets');
  }
  search(url,type) {
    if(url.indexOf('/spreadsheets/d/') > 0 ){
      var id = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(url)[1];
      console.log(id,type);
      SheetsAPI.checkSignInStatus(id);
    }else{
      console.log('Invalied URL Entered');
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Media Plan Picker</h1>
        </header>
        <ReadSheet onSearch={this.search}/>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
