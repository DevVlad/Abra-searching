import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import AutoComplete from 'material-ui/AutoComplete';
import injectTapEventPlugin from 'react-tap-event-plugin';

import DropdownField from '../redux/ducks/dropdownfield.jsx';

import './App.css';

injectTapEventPlugin();

function _stringify(object) {
	const seen = [];
	return JSON.stringify(object, (key, val) => {
		if (typeof val === 'object') {
			if (seen.indexOf(val) >= 0) {
				return undefined;
			}
			seen.push(val);
		}
		return val;
	}, 1);
}

class ContactDropdown extends React.Component{
	constructor(props){
		super(props);
	};

	handleInput(e) {
		this.props.dispatch(DropdownField.setList(e, this.props.alias, 0, 10));
		this.props.filterToCondition(e);
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
		// if(this.props.hint !== undefined) this.props.dispatch(DropdownField.setHint(undefined, this.props.alias, undefined, undefined));
	};

	//handle press ESC
	handleOnKeyDown(e) {
		if (e.keyCode === 27) {
			this.props.dispatch(DropdownField.setFilter(undefined, this.props.alias));
			this.props.dispatch(DropdownField.setHint(undefined, this.props.alias, undefined, undefined));
		}
	};

	render() {
		let list = [];
		if (this.props.hint !== undefined) {
			list = this.props.hint.toJS().map(item => {
				return {
					'id': item.id,
					'text': [item.prijmeni, item.jmeno].join(' ')
				};
			});
		}
		let text = this.props.filter || '';
		if (!text && this.props.entityId !== undefined) {
			let pom = this.props.entityToText;
			if (pom !== undefined) {
				text = [pom.prijmeni, pom.jmeno].join(' ');
				if (this.props.entityId !== pom.id) {
					this.props.dispatch(DropdownField.setValueOfEntityToText(this.props.entityId, this.props.alias));
				}
			} else {
				this.props.dispatch(DropdownField.setValueOfEntityToText(this.props.entityId, this.props.alias));
			}
		}
		console.log('ContactDropdown: render', this.props.filter);

		return (
      <div id="ContactDropdown">
  			<h1>ContactDropdown { this.props.alias }</h1>
	        <AutoComplete
		                floatingLabelText="Kontakt"
						id='dropdown'
						filter={ item => item }
		                menuProps={ { onKeyDown: this.handleOnKeyDown.bind(this)}}
						openOnFocus={ true }
						searchText={ text }
						menuStyle = { { maxHeight: '300px' } }
		                animated = { false }
						dataSource={ list }
						dataSourceConfig={ {  text: 'text', value: 'text'  } }
						onUpdateInput={ this.handleInput.bind(this) }
						onNewRequest={ this.handleOnSelect.bind(this) }
						onBlur={ this.handleOnBlur.bind(this) }

	        />
      </div>
		)
	};

};

function mapStateToProps(state, props) {
	return DropdownField.getOwnState(state, props.alias);
};

const appConnect = connect(mapStateToProps)(ContactDropdown);
export default appConnect;
