import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import AutoComplete from 'material-ui/AutoComplete';
import SvgIcon from 'material-ui/SvgIcon';
// import { red500 } from 'material-ui/styles/colors';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import DropdownFieldOld from '../redux/ducks/dropdownfieldold.jsx';
import CONSTANTS from './CONSTANTS.jsx';

import './App.css';

const ClearIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </SvgIcon>
);

class ContactDropdown extends React.Component{
  static propTypes = {
    alias: PropTypes.string,
    label: PropTypes.string,
    entityName: PropTypes.string,
    onChange: PropTypes.func,
    entityId: PropTypes.string,
    entityToText: PropTypes.object,
    filterToCondition: PropTypes.func,
    loadingNotify: PropTypes.bool
  };

	constructor(props){
		super(props);
		this.InMenu = [];
	};

  componentWillMount() {
    this.props.dispatch(DropdownFieldOld.setDelete(this.props.alias,['data']));
    // this.props.dispatch(DropdownFieldOld.setData([], this.props.alias, 0, false));
  };

	handleInput(e) {
		if(e) {
			this.inputDeleted = false;
			this.props.dispatch(DropdownFieldOld.setList(e, this.props.alias, 0, 10));
			this.props.filterToCondition(e);
			this.props.dispatch(DropdownFieldOld.setFilterMode(this.props.alias, true));
		} else {
			this.inputDeleted = true;
			this.props.dispatch(DropdownFieldOld.setFilterMode(this.props.alias, false));
		}
	};

	handleOnSelect(e) {
		if(this.props.hint) this.props.dispatch(DropdownFieldOld.setData([], this.props.alias, 0, false));
		if (this.props.onChange) this.props.onChange(e.id);
		this.props.dispatch(DropdownFieldOld.setFilterMode(this.props.alias, false));
		this.inputDeleted = false;
		setTimeout( () => { this.refs.textfield.focus() }, 0 );
		this.props.dispatch(DropdownFieldOld.setDelete(this.props.alias,['filter', 'loading']));
	};

	handleOnBlur() {
    let pom = '';
    if (this.props.entityToText &&  this.props.entityToText.prijmeni === '') {
      pom = this.props.entityToText.jmeno.trim();
    } else if (this.props.entityToText !== undefined && this.props.entityToText.jmeno === '') {
      pom = this.props.entityToText.prijmeni.trim();
    } else if (this.props.entityToText) {
      pom = [this.props.entityToText.prijmeni, this.props.entityToText.jmeno].join(' ').trim();
    }
    if (this.text !== pom && this.props.filterMode && this.props.entityToText !== undefined && this.props.hint.size === 0) {
      this.props.dispatch(DropdownFieldOld.setFilter(pom ,this.props.alias));
    }
		if (!this.props.entityToText && this.entityId && this.props.filter) {
      this.props.dispatch(DropdownFieldOld.setDelete(this.props.alias, ['filter', 'loading']));
    }
 		if (this.props.entityToText && this.inputDeleted) {
			//previous selected and deleted input => nothing to display
			this.props.dispatch(DropdownFieldOld.setDelete(this.props.alias,['filter', 'loading']));
			this.props.dispatch(DropdownFieldOld.setFilterMode(this.props.alias, false));
			if (this.inputDeleted && !this.props.filterMode) {
				this.props.onChange(undefined);
				this.inputDeleted = false;
			}
		}
		if (this.props.filter && this.props.hint && this.props.entityToText && !this.props.filterMode) {
			//delete input and leave
			this.props.dispatch(DropdownFieldOld.setDelete(this.props.alias,['filter', 'data', 'loading']));
			this.props.dispatch(DropdownFieldOld.setFilterMode(this.props.alias, false));
		}
		//handle if selected, start typing and leave

		if (this.props.filterMode && this.props.entityId !== undefined && this.InMenu.length === 0) {//this.InMenu[this.InMenu.length-1] === false) {
			this.props.dispatch(DropdownFieldOld.setDelete(this.props.alias, ['filter']));
		}
		//handle write, nothing selected a leave
		if (!this.props.entityId && this.props.filter && this.InMenu.length === 0) {
			this.props.dispatch(DropdownFieldOld.setDelete(this.props.alias, ['filter', 'data', 'loading']));
		}
	};

	handleOnKeyDown(e) {
		//handle press ESC
		if (e.keyCode === 27) {
			this.props.dispatch(DropdownFieldOld.setDelete(this.props.alias,['filter', 'data', 'loading']));
			if (this.props.hint && this.props.entityToText) this.props.dispatch(DropdownFieldOld.setDelete(this.props.alias,['filter']));
			setTimeout( () => { this.refs.textfield.focus() }, 0 );
		}
		if (e.keyCode === 40 || e.keyCode == 38) this.InMenu.push(true);
	};

	handleDeleteFromIcon() {
		this.props.onChange(undefined);
		this.props.dispatch(DropdownFieldOld.setDelete(this.props.alias, ['filter']));
	};

	handleOnBlurMenu() {
		this.InMenu.push(false);
		if (this.InMenu[this.InMenu.length-2] === false) {
			this.props.dispatch(DropdownFieldOld.setFilterMode(this.props.alias, false));
			this.props.dispatch(DropdownFieldOld.setDelete(this.props.alias, ['filter', 'data', 'loading']));
			this.InMenu = [];
		}
	};

  handleCurrentLoading(loading) {
    if (loading && this.props.loadingNotify) {
      return (
        <RefreshIndicator
          size={40}
          left={10}
          top={0}
          status="loading"
          style={ {
              display: 'inline-block',
              position: 'relative'
          } }
        />
      );
    }
  }

	render() {
		if (!this.props.entityId && this.props.entityToText) setTimeout( () => { this.props.dispatch(DropdownFieldOld.setDelete(this.props.alias, ['entityId', 'entityToText', 'filter'])) }, 0 );
		let list = [];
		if (this.props.hint !== undefined) {
			list = this.props.hint.toJS().map(item => {
				return {
					'id': item.id,
					'text': [item.prijmeni, item.jmeno].join(' ').trim()
				};
			});
		}
		this.text = this.props.filter || '';
		if (!this.props.filter && this.props.entityId !== undefined) {
			let pom = this.props.entityToText;
			if (pom !== undefined) {
				this.text = [pom.prijmeni, pom.jmeno].join(' ').trim();
				if (this.props.entityId !== pom.id) {
					this.props.dispatch(DropdownFieldOld.setValueOfEntityToText(this.props.entityId, this.props.alias));
				}
			} else if (!this.props.filter) {
				this.props.dispatch(DropdownFieldOld.setValueOfEntityToText(this.props.entityId, this.props.alias));
			}
		}

		return (
      <div id={`ContactDropdown_${this.props.alias}`}>
	      <AutoComplete
		        floatingLabelText={this.props.label}
		        ref="textfield"
						filter={ item => item }
						openOnFocus={ true }
						searchText={ this.text }
						menuProps={ { onKeyDown: this.handleOnKeyDown.bind(this), onBlur: this.handleOnBlurMenu.bind(this) } }
						menuStyle = { { maxHeight: '300px' } }
		        animated = { false }
						dataSource={ list }
						dataSourceConfig={ {  text: 'text', value: 'text'  } }
						onUpdateInput={ this.handleInput.bind(this) }
						onNewRequest={ this.handleOnSelect.bind(this) }
						onBlur={ this.handleOnBlur.bind(this) }
						onKeyDown={ this.handleOnKeyDown.bind(this) }
	      />
        { this.handleCurrentLoading(this.props.loading) }
				<ClearIcon visibility={ this.props.entityId ? 'visible' : 'hidden' } hoverColor={CONSTANTS.COLORS.error} onClick={ this.handleDeleteFromIcon.bind(this) }/>
      </div>
		);
	};

};

function mapStateToProps(state, props) {
  return {
    filter: DropdownFieldOld.getFilter(state, props.alias),
  			entityToText: DropdownFieldOld.getEntityToText(state, props.alias),
  			hint: DropdownFieldOld.getData(state, props.alias),
        filterMode: DropdownFieldOld.getFilterMode(state, props.alias),
        loading: DropdownFieldOld.getLoading(state, props.alias)
  };
};

const appConnect = connect(mapStateToProps)(ContactDropdown);
export default appConnect;
