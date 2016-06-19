import React from 'react';
import { connect } from 'react-redux';
import { setFilter } from '../actions/actions.jsx';
import { stateSelectorList } from '../selectors/selectors.jsx';
import './App.css'
import $ from 'jquery';
import select2 from 'select2';

class WhispererNew extends React.Component{
	constructor(props){
		super(props);
    this.list = [];
	}

  componentDidMount() {
    $("#id_label_multiple").select2({
      placeholder: "Search..."
    });
  }

  componentDidUpdate() {
    if (this.props.hint.size > 0) {
      let pom = this.props.hint.toJS().map(item => {
        return <div class="item" data-value={item.id}>{item.prijmeni, item.jmeno}</div>
      })
      this.list = pom;
    }
  }

	filterChange(e) {
    this.props.dispatch(setFilter(e.target.value));
	}

	render() {

		return (
      <div id="whisperNew">
  			<form role="formWhispererNew">
  				<label className="labelWhispererNew">WhisperNew for...</label>
            <input
              type="text"
              placeholder="Search"
              onChange={this.filterChange.bind(this)}
              list="pokus"
            />
            <datalist id="pokus">
              {this.props.hint.toJS().map(item=>{return <option id={'a'+item.id}>{item.prijmeni} {item.jmeno}</option>})}
            </datalist>
            
  			</form>
      </div>
		)
	}
}

function mapStateToProps(state) {
  return stateSelectorList(state)
}

const appConnect = connect(mapStateToProps)(WhispererNew);
export default appConnect;
