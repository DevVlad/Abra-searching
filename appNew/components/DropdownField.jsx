import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DropdownFieldDumb from './DropdownFieldDumb.jsx';
import SvgIcon from 'material-ui/SvgIcon';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Immutable from 'immutable';

import DropdownFieldDuck from '../redux/ducks/dropdownfieldDuck.jsx';

import CONSTANTS from './CONSTANTS.jsx';

import './App.css';

const ClearIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </SvgIcon>
);

class DropdownField extends React.Component{
  static propTypes = {
    alias: PropTypes.string,
    label: PropTypes.string,
    entityName: PropTypes.string,
    errorText: PropTypes.string,
    warnText: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    entityToText: PropTypes.func,
    entityType: PropTypes.string,
    filterToCondition: PropTypes.func,
    loadingNotify: PropTypes.bool,
    value: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.list = [];
    this.insertMode = true;
  }

  componentWillReceiveProps(newProps) {
    if (newProps.entity && parseInt(newProps.entity.id) === newProps.value) {
      this.list = [];
      this.list[0] = newProps.entity;
      this.insertMode = false;
    }
    if (newProps.data && newProps.data.size > 0) this.list = newProps.data.toJS();
  }

  componentDidUpdate() {
    if (this.props.entity && parseInt(this.props.entity.id) === this.props.value) {
      this.insertMode = true;
      this.list = [];
    }
  }

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

  handleOnBLur(e) {
    if (!this.insertMode) this.insertMode = true;
    if (this.props.data || this.props.filter) this.props.dispatch(DropdownFieldDuck.setDelete(this.props.alias, ['filter', 'data']));
  }

  handleOnSelect(e) {
    if (!this.insertMode) this.insertMode = true;
    this.props.dispatch(DropdownFieldDuck.setDelete(this.props.alias, ['filter', 'data']));
    this.props.onChange(e.id);
  }

  handleOnChange(e) {
    this.props.onChange(e);
  }

  handleIncoming(e) {
    if (this.insertMode) {
      if (!this.props.entity || (parseInt(this.props.entity.id) !== this.props.value)) {
        this.props.dispatch(DropdownFieldDuck.setValueOfEntityId(this.props.entityType, this.props.value, this.props.alias));
      }
    }
  }

  handleOnKeyDown(e) {
    //handle press ESC
    // if (e.keyCode === 27) {
    //   this.props.dispatch(DropdownFieldDuck.setDelete(this.props.alias,['filter', 'data', 'loading']));
    //   if (this.props.hint && this.props.entityToText) this.props.dispatch(DropdownFieldDuck.setDelete(this.props.alias,['filter']));
    // }
    // if (e.keyCode === 40 || e.keyCode == 38) this.InMenu.push(true);
  }

  handleOnFocus(e) {
    this.list.length === 0 ? this.showMenu = false : this.showMenu = undefined;
  }

  handleTyping(e) {
    this.insertMode = false;
    this.setState({toDisplay: e});
    this.props.dispatch(DropdownFieldDuck.setDataForMenu(this.props.entityType, this.props.filterToCondition(e), this.props.alias));
  }

  handleDeleteFromIcon() {
    this.props.onChange(undefined);
    this.props.dispatch(DropdownFieldDuck.setDelete(this.props.alias, ['filter']));
  }

  render() {
    return (
      <div id="DropdownField">
        <DropdownFieldDumb
          alias={ this.props.alias }
          label={ this.props.label }
          data={ this.list }
          errorText={ this.props.errorText }
          warnText={ this.props.warnText }
          onKeyDown={ this.handleOnKeyDown.bind(this) }
          onChange={ this.props.onChange.bind(this) }
          onSelect={ this.handleOnSelect.bind(this) }
          // onBlur={ this.handleOnBLur.bind(this) }
          entityToText={ this.props.entityToText }
          entityToValue={ object => object.id }
          value={ this.props.value }
          // value={ this.insertMode ? this.props.value : this.state.toDisplay }
          onTyping={ this.handleTyping.bind(this) }
          filter={ item => item }
          enableDev={ true }
          entity={ this.props.entity ? this.props.entity : null }
          notIncludedInData={ this.handleIncoming.bind(this) }
          onFocus={ this.handleOnFocus.bind(this) }
          showMenu={ this.showMenu }
          />
      { this.handleCurrentLoading(this.props.loading) }
      </div>
    );
  };

};

function mapStateToProps(state, props) {
  return {...props,
    filter: DropdownFieldDuck.getFilter(state, props.alias),
    data: DropdownFieldDuck.getData(state, props.alias),
    loading: DropdownFieldDuck.getLoading(state, props.alias),
    entity: DropdownFieldDuck.getEntityfromId(state, props.alias)
  };
};

const appConnect = connect(mapStateToProps)(DropdownField);
export default appConnect;
