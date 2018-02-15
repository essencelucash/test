import React from 'react';
import './PropertyList.css';
import Property from '../Property/Property';

class PropertyList extends React.Component {
  render(){
    return(
      <div className="TrackList">
      {this.props.property.map(property =>
        <Property key={property.name} property={property} planBudget={this.props.planBudget} onAdd={this.props.onAdd} onRemove={this.props.onRemove}/>
      )}
      </div>
    );
  }
}

export default PropertyList;
