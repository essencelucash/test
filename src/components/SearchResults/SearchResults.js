import React from 'react';
import './SearchResults.css';
import PropertyList from '../PropertyList/PropertyList';

class SearchResults extends React.Component {
  setStrike(){
    let resultsList = this.props.searchResults;
    let planList = this.props.mediaPlan;

    resultsList.map(item => {
      let found = false;
      planList.forEach(prop => {
        if(item.name === prop.name){
          found =true;
        }
      });
      if(!found){
        item.strikeFormat = false;
      }else{
        item.strikeFormat = true;
      }
    });

    return resultsList;
  }
  render(){
    return(
      <div className="SearchResults">
        <h3>Suggested Properties from Historic plans</h3>
        <div className="SearchResults-Return">
          <div className="Property-information">
            <PropertyList planBudget={this.props.planBudget} property={this.setStrike()} onAdd={this.props.onAdd}/>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchResults;
