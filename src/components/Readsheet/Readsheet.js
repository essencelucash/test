import React from 'react';
import './Readsheet.css';

class ReadSheet extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      search: '',
      type: 'Performance'
    };

    this.searchForOptions = {
      'Brand': 'Brand',
      'DR': 'Performance'
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSearchForChange = this.handleSearchForChange.bind(this);
  }

  searchForClass(option){
    if(option === this.state.type) {
      return 'active';
    } else {
      return '';
    }
  }

  handleSearchForChange(option) {
    this.setState({type: option});
  }

  handleSearch(event){
    if(this.state.search !== ''){
      this.props.onSearch(this.state.search,this.state.type);
    }
  }

  handleTermChange(event){
    this.setState({search: event.target.value})
  }

  handleKeyPress(event){
    if(event.key === 'Enter') {
      console.log('"Enter" hit, now pull report...');
      this.handleSearch(event);
    }
  }

  renderSortByOptions() {
    return Object.keys(this.searchForOptions).map(option => {
      let searchForOptionValue = this.searchForOptions[option];
      return <li className={this.searchForClass(searchForOptionValue)}
      key={searchForOptionValue}
      onClick={this.handleSearchForChange.bind(this,searchForOptionValue)}>
      {option}
      </li>;
    });
  }

  render(){
    return (
      <div className="SearchBar">
      <div className="SearchBar-sort-options">
      <input onChange={this.handleTermChange} onKeyPress={this.handleKeyPress} placeholder="Input Google Spreadsheet URL" />
      <ul>
      {this.renderSortByOptions()}
      </ul>
      </div>
      <a onClick={this.handleSearch}>Pull Report</a>
      </div>
    );
  }
}

export default ReadSheet;
