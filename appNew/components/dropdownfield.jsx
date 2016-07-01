import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import AutoComplete from 'material-ui/AutoComplete';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SvgIcon from 'material-ui/SvgIcon';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import DropdownField from '../redux/ducks/dropdownfield.jsx';

import './App.css';

injectTapEventPlugin();

const HomeIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
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
		console.log('input', this.props, this.inputDeleted)
	};

	handleOnSelect(e) {
		if(this.props.hint !== undefined) this.props.dispatch(DropdownField.setHint(undefined, this.props.alias, undefined, undefined));
		if (this.props.onChange) {
			this.props.onChange(e.id);
		}
		this.props.dispatch(DropdownField.setFilter(undefined, this.props.alias));
		this.inputDeleted = false;
	};

	handleOnBlur() {
		if (this.props.entityToText) {
			this.props.dispatch(DropdownField.setFilter(undefined, this.props.alias));
			console.log('blur', this.props, this.inputDeleted)
			// if (this.inputDeleted) this.setState({});
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
					console.log('0')
					this.props.dispatch(DropdownField.setValueOfEntityToText(this.props.entityId, this.props.alias));
				}
			} else if (!this.props.filter) {
				console.log('1')
				this.props.dispatch(DropdownField.setValueOfEntityToText(this.props.entityId, this.props.alias));
			}
		}
		console.log('ContactDropdown: render', this.props, this.inputDeleted);

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
						onKeyDown={ this.handleOnKeyDown.bind(this) }
						iconClassName="muidocs-icon-custom-github"
	        /> <HomeIcon color={red500} hoverColor={greenA200} />

      </div>
		);
	};

};

function mapStateToProps(state, props) {
	return DropdownField.getOwnState(state, props.alias);
};

const appConnect = connect(mapStateToProps)(ContactDropdown);
export default appConnect;
