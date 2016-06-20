import React from 'react';
import { connect } from 'react-redux';
import { setFilter } from '../actions/actions.jsx';
import { stateSelectorList } from '../selectors/selectors.jsx';
import Select2 from 'react-select2-wrapper';
import 'react-select2-wrapper/css/select2.css';

import './App.css'


class WhispererNew extends React.Component{
	constructor(props){
		super(props);
	}

	filterChange(e) {
    this.props.dispatch(setFilter(e.target.value));
	}

	handleSelect(e) {
		this.inputValue = e.target[e.target.selectedIndex].text;
		this.props.dispatch(setFilter(this.props.hint.toJS()[e.target.selectedIndex].prijmeni));
		console.log()
	}

	handleOnChange(e) {
		console.log(e, document.getElementsByClassName('select2-search__field'))
	}

	render() {
		this.inputValue = this.props.filter;
		this.list = [];
		this.list = this.props.hint.toJS().map(item => {
			return {
				'text': [item.prijmeni, item.jmeno].join(' '),
				'id': item.id
			}
		});

		return (
      <div id="whisperNew">
  			<form role="formWhispererNew">
  				<label className="labelWhispererNew">WhisperNew for...</label>
          <input
						id='inputNew'
            type="text"
						value={this.inputValue}
            placeholder="Search"
            onChange={this.filterChange.bind(this)}
						ref={(ref) => this.inputRef = ref}
          />
				<Select2
					id="select2Whisper"
					ref={(ref) => this.selectRef = ref}
					data={this.list}
					onSelect={this.handleSelect.bind(this)}
					onChange={this.handleOnChange.bind(this)}
				  options={{
					  placeholder: 'search...'
					}}
				/>
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
