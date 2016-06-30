import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import AutoComplete from 'material-ui/AutoComplete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import DropdownField from '../redux/ducks/DropdownField.jsx';

import './App.css';

injectTapEventPlugin();
class ContactDropdown extends React.Component{
	constructor(props){
		super(props);
	};

	handleInput(e) {
		this.props.dispatch(DropdownField.setList(e, this.props.alias, 0, 10));
		// this.props.dispatch(DropdownField.setCondition(e, this.props.alias))
	};

	handleOnSelect(e) {
		if(this.props.hint !== undefined) this.props.dispatch(DropdownField.setHint(undefined, this.props.alias, undefined, undefined));
		// this.props.dispatch(DropdownField.setCondition(e.text, this.props.alias))
		if (this.props.onChange) {
			this.props.onChange(e.id);
		}
	};

	handleOnBlur() {
		if(this.props.hint !== undefined) this.props.dispatch(DropdownField.setHint(undefined, this.props.alias, undefined, undefined));
	};

	render() {
		console.log('props of dropdownfield', this.props);
		let list = [];
		if (this.props.hint !== undefined) {
			list = this.props.hint.toJS().map(item => {
				return {
					'id': item.id,
					'text': [item.prijmeni, item.jmeno].join(' ')
				};
			});
		}
		let text = '';
		if (this.props.entityId !== undefined) {
			let pom = this.props.entityToText;
			if (pom !== undefined) {
				text = [pom.prijmeni, pom.jmeno].join(' ');
				if (this.props.entityId !== pom.id) {
					this.props.dispatch(DropdownField.setValueOfEntityToText(this.props.entityId, this.props.alias));
				}
			} else {
				console.log(this.props.alias,'kokooooot')
				this.props.dispatch(DropdownField.setValueOfEntityToText(this.props.entityId, this.props.alias));
			}
		}

		return (
      <div id="ContactDropdown">
  			<h1>ContactDropdown { this.props.alias }</h1>
				<MuiThemeProvider>
	        <AutoComplete
						id='dropdown'
						filter={ item => item }
	          placeholder='Search...'
						openOnFocus={ true }
						searchText={ text }
						menuStyle = { { maxHeight: '300px' } }
						dataSource={ list }
						dataSourceConfig={ {  text: 'text', value: 'text'  } }
						onUpdateInput={ this.handleInput.bind(this) }
						onNewRequest={ this.handleOnSelect.bind(this) }
						onBlur={ this.handleOnBlur.bind(this) }
	        />
				</MuiThemeProvider>
      </div>
		)
	};

};

function mapStateToProps(state, props) {
	return DropdownField.getOwnState(state, props.alias);
};

const appConnect = connect(mapStateToProps)(ContactDropdown);
export default appConnect;
