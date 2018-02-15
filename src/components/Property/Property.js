import React from 'react';
import './Property.css';

class Property extends React.Component{
  constructor(props) {
    super(props)

    this.addProperty = this.addProperty.bind(this);
    this.removeProperty = this.removeProperty.bind(this);
  }

  renderAction() {
    if (this.props.onRemove) {
      return <a className="Property-action" onClick={this.removeProperty}>Remove</a>;
    }
    return <a className="Property-action" onClick={this.addProperty}>Add</a>;
  }

  addProperty(event){
    this.props.onAdd(this.props.property);
  }

  removeProperty(event){
    this.props.onRemove(this.props.property);
  }
  estimatedBudget(){
    let budget = this.props.planBudget;
    console.log(budget);
    if(!this.props.property['predictedBudget']){
      this.props.property['predicetedBudget'] = 0;
    }
    if(budget > 99999){
      let predictedBudget = this.props.property.budgetPercent*budget;
      this.props.property['predictedBudget'] = predictedBudget;
      if (predictedBudget < this.props.property.maxBudget){
        return addComas(predictedBudget);
      }else{
        return addComas(this.props.property.maxBudget);
      }
    }else{
      return 0;
    }
  }
  render(){
    return(
      <div className="Property">
      <div className="Property-information">
      <h3>{this.props.property.name}</h3>
      <p>Historic CPA: ${this.props.property.cpa} | Recomended Budget: ${this.estimatedBudget()}</p>
      </div>
      {this.renderAction()}
      </div>
    );
  }
}

export default Property;

function addComas(amount){
  var delimeter = ",";
  var a = amount.toString().split('.',2);
  //console.log(a);
  var d = a[0].replace(/,/g,'');
  var i = parseInt(d,10);
  if(isNaN(i)){
    return ''
  }
  var n = new String(i);
  var x = [];
  while(n.length > 3){
    var nn = n.substring(n.length-3);
    x.unshift(nn);
    n = n.substr(0,n.length-3);
  }
  if(n.length > 0 ){
    x.unshift(n);
  }
  n = x.join(delimeter);
  Math.round(n);
  //console.log(n);
  return n;
}
