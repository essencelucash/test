import React from 'react';
import './SearchResults.css';
import PropertyList from '../PropertyList/PropertyList';

class SearchResults extends React.Component {
  render(){
    return(
      <div className="SearchResults">
        <h3>Suggested Properties from Historic plans</h3>
        <div className="SearchResults-Return">
          <div className="Track-information">
            <PropertyList planBudget={this.props.planBudget} property={this.props.searchResults} onAdd={this.props.onAdd}/>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchResults;
