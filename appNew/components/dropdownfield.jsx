import React from 'react';
import { connect } from 'react-redux';
//import $ from 'jquery';
import AutoComplete from 'material-ui/AutoComplete';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SvgIcon from 'material-ui/SvgIcon';
import { red500 } from 'material-ui/styles/colors';
import DropdownField from '../redux/ducks/dropdownfield.jsx';

import './App.css';

injectTapEventPlugin();

const ClearIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </SvgIcon>
);

class ContactDropdown extends React.Component{
	constructor(props){
		super(props);
	};

	handleInput(e) {
		if (e) {
			this.inputDeleted = false;
			this.props.dispatch(DropdownField.setList(e, this.props.alias, 0, 10));
			this.props.filterToCondition(e);
		} else {
			this.inputDeleted = true;
		}
	};

	handleOnSelect(e) {
		if(this.props.hint !== undefined) this.props.dispatch(DropdownField.setHint(undefined, this.props.alias, undefined, undefined));
		if (this.props.onChange) {
			this.props.onChange(e.id);
		}
		this.props.dispatch(DropdownField.setFilter(undefined, this.props.alias));
		this.inputDeleted = false;
		this.refs.textfield.focus();
		setTimeout( () => { this.refs.textfield.focus() }, 0 );
	};

	handleOnBlur() {
		console.log('ContactDropdown: onBlur');
		if (this.props.entityToText && this.inputDeleted) {
			this.props.dispatch(DropdownField.setFilter(undefined, this.props.alias));
			if (this.inputDeleted) {
				this.props.onChange(undefined);
				this.inputDeleted = false;
			}
		}
	};

	//handle press ESC
	handleOnKeyDown(e) {
		if (e.keyCode === 27) {
			this.props.dispatch(DropdownField.setFilter(undefined, this.props.alias));
			this.props.dispatch(DropdownField.setHint(undefined, this.props.alias, undefined, undefined));
			if (this.props.hint.size > 0 && this.props.entityToText) this.props.dispatch(DropdownField.setFilter(undefined, this.props.alias));
		}
	};

	handleDeleteFromIcon() {
		this.props.onChange(undefined);
		this.props.dispatch(DropdownField.setDeleteAll(this.props.alias));
		// this.props.dispatch(DropdownField.setValueOfEntityToText(this.props.entityId, this.props.alias));
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

		if (!this.props.filter && this.props.entityId !== undefined) {
			let pom = this.props.entityToText;
			if (pom !== undefined) {
				text = [pom.prijmeni, pom.jmeno].join(' ');
				if (this.props.entityId !== pom.id) {
					this.props.dispatch(DropdownField.setValueOfEntityToText(this.props.entityId, this.props.alias));
				}
			} else if (!this.props.filter) {
				this.props.dispatch(DropdownField.setValueOfEntityToText(this.props.entityId, this.props.alias));
			}
		}

		return (
      <div id="ContactDropdown">
  			<h1>ContactDropdown { this.props.alias }</h1>
	        <AutoComplete
		        floatingLabelText="Kontakt"
		                ref="textfield"
						filter={ item => item }
		        menuProps={ { onKeyDown: this.handleOnKeyDown.bind(this) } }
						openOnFocus={ true }
						searchText={ text }
						menuStyle = { { maxHeight: '300px' } }
		        animated = { false }
						dataSource={ list }
						dataSourceConfig={ {  text: 'text', value: 'text'  } }
						onUpdateInput={ this.handleInput.bind(this) }
						onNewRequest={ this.handleOnSelect.bind(this) }
						onBlur={ this.handleOnBlur.bind(this) }
						onKeyDown={ this.handleOnKeyDown.bind(this) }
						iconClassName="muidocs-icon-custom-github"
	        /> <ClearIcon visibility={ this.props.entityId ? 'visible' : 'hidden' } hoverColor={red500} onClick={ this.handleDeleteFromIcon.bind(this) }/>

      </div>
		);
	};

};

function mapStateToProps(state, props) {
	return DropdownField.getOwnState(state, props.alias);
};

const appConnect = connect(mapStateToProps)(ContactDropdown);
export default appConnect;
