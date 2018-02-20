import React from 'react';
import './Property.css';

class Property extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      customBudgetAmount: '',
      placeHolder: 0
    }

    this.addProperty = this.addProperty.bind(this);
    this.removeProperty = this.removeProperty.bind(this);
    this.handleCustomChange = this.handleCustomChange.bind(this);
  }
  handleCustomChange(event){
    console.log(event.target.value);
    var number = event.target.value;
    console.log(number);
    if(number !== ''){
      this.props.property.customBudget = true;
      this.props.property.predictedBudget = number;
    this.setState({
      customBudgetAmount: addComas(number)
    });
  }else{
    this.props.property.customBudget = false;
  }

  }

  renderAction() {
    if (this.props.onRemove) {
      return <a className="Property-action" onClick={this.removeProperty}>Remove</a>;
    }
    return <a className="Property-action" onClick={this.addProperty}>Add</a>;
  }

  addProperty(event){
    console.log(this.props.property);
    this.props.onAdd(this.props.property);
  }

  removeProperty(event){
    console.log(this.props.property);
    this.props.onRemove(this.props.property);
  }
  textFormat(){
    if(this.props.property.strikeFormat){
      return (
        <div className="Property-information-strike">
        <h3>{this.props.property.name}</h3>
        <p>Historic CPA: ${this.props.property.cpa} | Recomended Budget: ${this.estimatedBudget()}</p>
        </div>
      );
    }else{
      return(
      <div className="Property-information">
      <h3>{this.props.property.name}</h3>
      <p>Historic CPA: ${this.props.property.cpa} | Recomended Budget: ${this.estimatedBudget()}</p>
      </div>
    );
    }
  }
  estimatedBudget(){
    let budget = this.props.planBudget;
    //console.log(budget);
    if(budget > 99999){
      let estimateBudget = this.props.property.budgetPercent*budget;
          if(!this.props.property.customBudget){
      this.props.property.predictedBudget = estimateBudget;
    }
      if (estimateBudget < this.props.property.maxBudget){
        return addComas(estimateBudget);
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
      {this.textFormat()}
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
  var n = i.toString();
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
