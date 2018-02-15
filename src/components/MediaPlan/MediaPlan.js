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
  }
  passBudget(budget){
    budget = parseInt(budget.replace(/,/g,''),10);
    //console.log(budget);
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
  budgetEstimate(){
    //console.log(Math.round(this.state.mediaPlanBudget.replace(/,/g,'')));
    //console.log(this.props.projectedBudget);
    if(this.props.projectedBudget > Math.round(this.state.mediaPlanBudget.replace(/,/g,''))){
      return <p className="TotalBudget-above">${this.addComas(this.props.projectedBudget.toString())}</p>
    }else{
      return <p className="TotalBudget-below">${this.addComas(this.props.projectedBudget.toString())}</p>
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
        <PropertyList property={this.props.mediaPlan} planBudget={this.props.planBudget} onRemove={this.props.onRemove}/>
        </div>
      </div>
    );
  }
}

export default MediaPlan;
