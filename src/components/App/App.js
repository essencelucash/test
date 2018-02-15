import React, { Component } from 'react';
import logo from './Olive3.png';
import ReadSheet from '../Readsheet/Readsheet';
import SheetsAPI from '../../utility/SheetsApi'
import SearchResults from '../SearchResults/SearchResults';
import MediaPlan from '../MediaPlan/MediaPlan';
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      searchResults: [],
      mediaPlan: [],
      projectedBudget : 0,
      mediaPlanBudget : 0,
    };

    this.search = this.search.bind(this);
    this.addProperty = this.addProperty.bind(this);
    this.removeProperty = this.removeProperty.bind(this);
    this.newBudget = this.newBudget.bind(this);
  }
  addProperty(property){
    //console.log(property);
    let mediaPlanProperties = this.state.mediaPlan;
    let found = false;
    let addBudget = this.state.projectedBudget;
    mediaPlanProperties.forEach(item => {
      if(item.name === property.name) {
        found = true;
      }
    });
    if(!found){
      mediaPlanProperties.push(property);
    }
    this.setState(
      {
        mediaPlan : mediaPlanProperties,
        projectedBudget: addBudget
      }
    );
    //console.log(addBudget);
  }
  newBudget(budget){
    //console.log(budget);
    this.setState({mediaPlanBudget : budget});
  }
  removeProperty(property){
    let mediaPlanProperties = this.state.mediaPlan;
    let removeBudget = this.state.projectedBudget;
    mediaPlanProperties = mediaPlanProperties.filter(item => {
      return (item.name !== property.name);
    });
    this.setState(
      {
        mediaPlan : mediaPlanProperties,
        projectedBudget : removeBudget
      }
    );
    console.log(removeBudget);
  }
  projectedBudget(){
    let projection = 0;
    if(this.state.mediaPlanBudget > 99999){
      this.state.mediaPlan.forEach(property => {
        projection += Math.round(property.predictedBudget.toString().replace(/,/g,''));
      });
    }
    return projection;
    //console.log(projection);
  }
  search(url,type) {
    if(url.indexOf('/spreadsheets/d/') > 0 ){
      var id = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(url)[1];
      console.log(id,type);
        SheetsAPI.checkSignInStatus(id,type).then(searchResults => {
          this.setState({searchResults: searchResults})
        });
        console.log(this.state.searchResults);
    }else{
      console.log('Invalied URL Entered');
    }
  }
  render() {
    return (
      <div>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Media Plan Picker</h1>
            </header>
            <ReadSheet onSearch={this.search}/>
            <div className="App-mediaPlan">
              <SearchResults searchResults={this.state.searchResults} planBudget={this.state.mediaPlanBudget} onAdd={this.addProperty}/>
              <MediaPlan projectedBudget={this.projectedBudget()} planBudget={this.state.mediaPlanBudget} mediaPlan={this.state.mediaPlan} onRemove={this.removeProperty} newBudget={this.newBudget}/>
            </div>
        </div>
      </div>
    );
  }
}

export default App;
