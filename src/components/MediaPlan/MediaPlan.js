import React from 'react';
import './MediaPlan.css'
import PropertyList from '../PropertyList/PropertyList';

class MediaPlan extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      mediaPlanBudget: '',
      budgetEstimate: 0,
      placeholder: 'Input Budget'
    }
    this.handleBudgetChange = this.handleBudgetChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.budgetEstimate = this.budgetEstimate.bind(this);
  }
  addComas(amount){
    var delimeter = ",";
    var a = amount.split('.',2);
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
    n = x.join(delimeter)
    //console.log(n);
    return n;
  }
  handleBudgetChange(event){
    //console.log(event.target.value);
    var number = this.addComas(event.target.value);
    //console.log(number);
    this.setState({
      mediaPlanBudget: this.addComas(number)
    })
    this.passBudget(number);
    //console.log(this.props.mediaPlan);
  }
  passBudget(budget){
    budget = Math.round(Number(budget.toString().replace(/,/g,'')));
    if(isNaN(budget)){
      this.props.newBudget(0);
    }else{
      this.props.newBudget(budget);
    }
  }
  handleSave(event){
    this.props.onSave(this.state.playlistName);
    this.setState({
      playlistName: ''
    });
  }
  removeStrike(){
    var propertyList = this.props.mediaPlan;
    propertyList.map(item => {
      return (item.strikeFormat = false);
    });
    //console.log(propertyList);
    return propertyList;
  }
  budgetEstimate(){
    //console.log(Math.round(this.state.mediaPlanBudget.replace(/,/g,'')));
    //console.log(this.props.projectedBudget);
    let mediaPlanList = this.props.mediaPlan;
    let projectedBudget = 0;
    if(Number(this.state.mediaPlanBudget.replace(/,/g,'')) > 99999){
      mediaPlanList.forEach(property => {
        if(property.predictedBudget > property.maxBudget){
           return projectedBudget += Math.round(property.maxBudget);
        }else{
           return projectedBudget += Math.round(property.predictedBudget.toString().replace(/,/g,''));
        }
      });
    }
    if(projectedBudget > Math.round(this.state.mediaPlanBudget.replace(/,/g,''))){
      return <p className="TotalBudget-above">${this.addComas(projectedBudget.toString())}</p>
    }else{
      return <p className="TotalBudget-below">${this.addComas(projectedBudget.toString())}</p>
    }
  }
  render(){
    return(
      <div className="MediaPlan">
        <div>Media Plan Budget:
          $<input onChange={this.handleBudgetChange} value={this.state.mediaPlanBudget} placeholder={this.state.placeholder}/>
        </div>
        <div className="TotalBudget">Estimated total with fees: {this.budgetEstimate()}</div>
        <a className="Sheet-Export">Export to Sheet</a>
        <div className="MediaPlan-properties">
        <PropertyList property={this.removeStrike()} planBudget={this.props.planBudget} onRemove={this.props.onRemove}/>
        </div>
      </div>
    );
  }
}

export default MediaPlan;
