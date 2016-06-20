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
		// console.log('WhispererNew: handleSelect', e);
		this.inputValue = e.target[e.target.selectedIndex].text;
		this.props.dispatch(setFilter(this.props.hint.toJS()[e.target.selectedIndex].prijmeni));
	}

	handleOnChange(e) {
			// console.log('WhispererNew: handleChange', e);
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

		if (this.success && this.list && this.list.length > 0) {
			this.success({ results: this.list });
		}

		return (
      <div id="whisperNew">
  			<form role="formWhispererNew">
  				<label className="labelWhispererNew">WhisperNew for...</label>
          <input
						id='inputNew'
            type="text"
						value={this.inputValue}
            placeholder="Search"

						ref={(ref) => this.inputRef = ref}
          />{/*onChange={this.filterChange.bind(this)}  data={this.list}*/}
				<Select2
					id="select2Whisper"
					ref={(ref) => this.selectRef = ref}

					onSelect={this.handleSelect.bind(this)}
					onChange={this.handleOnChange.bind(this)}
				  options={{
					  placeholder: 'search...',
					  ajax: {
					    transport: (params, success) => {
					        // console.log('ajax: transport', params, success);
					        this.success = success;
									this.filterChange({target: {value:params.data.q}});
					    }
					  }
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
