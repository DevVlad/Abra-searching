import React from 'react';
import { connect } from 'react-redux';
import AutoComplete from 'material-ui/AutoComplete';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SvgIcon from 'material-ui/SvgIcon';
import { red500 } from 'material-ui/styles/colors';
import DropdownField from '../redux/ducks/dropdownfield.jsx';
import Loading from './loading.jsx';

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
		this.InMenu = [];
	};

	handleInput(e) {
		if (e) {
			this.inputDeleted = false;
			this.props.dispatch(DropdownField.setList(e, this.props.alias, 0, 10));
			this.props.filterToCondition(e);
			this.props.dispatch(DropdownField.setFilterMode(this.props.alias, true));
		} else {
			this.inputDeleted = true;
			this.props.dispatch(DropdownField.setFilterMode(this.props.alias, false));
		}
	};

	handleOnSelect(e) {
		if(this.props.hint !== undefined) this.props.dispatch(DropdownField.setDelete(this.props.alias,['hint']));
		if (this.props.onChange) this.props.onChange(e.id);
		// this.props.dispatch(DropdownField.setDelete(this.props.alias,['filter']));
		this.props.dispatch(DropdownField.setFilterMode(this.props.alias, false));
		this.inputDeleted = false;
		setTimeout( () => { this.refs.textfield.focus() }, 0 );
	};

	handleOnBlur() {
		// console.log(this.props, 'onblur', this.inputDeleted, this.InMenu[this.InMenu.length-1])
		if (!this.props.entityToText && this.entityId && this.props.filter) this.props.dispatch(DropdownField.setDelete(this.props.alias, ['filter']));
 		if (this.props.entityToText && this.inputDeleted) {
			//previous selected and deleted input => nothing to display
			this.props.dispatch(DropdownField.setDelete(this.props.alias,['filter']));
			this.props.dispatch(DropdownField.setFilterMode(this.props.alias, false));
			if (this.inputDeleted && !this.props.filterMode) {
				this.props.onChange(undefined);
				this.inputDeleted = false;
			}
		}
		if (this.props.filter && this.props.hint && this.props.entityToText && !this.props.filterMode) {
			//delete input and leave
			this.props.dispatch(DropdownField.setDelete(this.props.alias,['filter', 'hint', 'loading']));
			this.props.dispatch(DropdownField.setFilterMode(this.props.alias, false));
		}
		//handle if selected, start typing and leave
		if (this.props.filterMode && this.props.entityId && this.InMenu[this.InMenu.length-1] === false) {
			this.props.dispatch(DropdownField.setDelete(this.props.alias, ['filter']));
		}
		//handle write, nothing selected a leave
		if (!this.props.entityId && this.props.filter && this.InMenu.length === 0) {
			this.props.dispatch(DropdownField.setDelete(this.props.alias, ['filter', 'hint', 'loading']));
		}

	};

	handleOnKeyDown(e) {
		//handle press ESC
		if (e.keyCode === 27) {
			this.props.dispatch(DropdownField.setDelete(this.props.alias,['filter', 'hint', 'loading']));
			if (this.props.hint && this.props.entityToText) this.props.dispatch(DropdownField.setDelete(this.props.alias,['filter']));
			setTimeout( () => { this.refs.textfield.focus() }, 0 );
		}
		if (e.keyCode === 40 || e.keyCode == 38) this.InMenu.push(true);
	};

	handleDeleteFromIcon() {
		this.props.onChange(undefined);
		this.props.dispatch(DropdownField.setDelete(this.props.alias, ['filter']));
	};

	handleOnBlurMenu() {
		this.InMenu.push(false);
		if (this.InMenu[this.InMenu.length-2] === false) {
			console.log('menublur', this.props);
			this.props.dispatch(DropdownField.setFilterMode(this.props.alias, false));
			this.props.dispatch(DropdownField.setDelete(this.props.alias, ['filter', 'hint']));
			this.InMenu = [];
		}
	};

	render() {
		//  if (!this.props.entityId && this.props.entityToText) {debugger; setTimeout( () => { this.props.dispatch(DropdownField.setDelete(this.props.alias, ['entityId', 'entityToText', 'filter'])) }, 0 );}
		// console.log('render', this.props)
		let list = [];
		if (this.props.hint !== undefined) {
			list = this.props.hint.toJS().map(item => {
				return {
					'id': item.id,
					'text': [item.prijmeni, item.jmeno].join(' ').trim()
				};
			});
		}
		let text = this.props.filter || '';
		if (!this.props.filter && this.props.entityId !== undefined) {
			let pom = this.props.entityToText;
			if (pom !== undefined) {
				text = [pom.prijmeni, pom.jmeno].join(' ').trim();
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
		        menuProps={ { onKeyDown: this.handleOnKeyDown.bind(this), onBlur: this.handleOnBlurMenu.bind(this) } }
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
	        />
				<ClearIcon visibility={ this.props.entityId ? 'visible' : 'hidden' } hoverColor={red500} onClick={ this.handleDeleteFromIcon.bind(this) }/>
				<Loading loading={this.props.loading} />
      </div>
		);
	};

};

function mapStateToProps(state, props) {
	return DropdownField.getOwnState(state, props.alias);
};

const appConnect = connect(mapStateToProps)(ContactDropdown);
export default appConnect;
