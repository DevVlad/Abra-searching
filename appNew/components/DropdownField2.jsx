import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DropdownFieldDumb2 from './DropdownFieldDumb2.jsx';
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
let list = [];
let insertMode = true;
let isTyping = false;
// let isEntity = false;
let isEntity = true;

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
  }

  componentWillReceiveProps(newProps) {
    if (newProps.entity && parseInt(newProps.entity.id) === newProps.value && insertMode && isEntity) {
      list = [];
      list[0] = newProps.entity;
    }
    if (newProps.data && (!insertMode || isTyping || !isEntity)) {
      list = newProps.data.toJS();
      isEntity = true;
    }
    if (!newProps.value && newProps.entity) newProps.dispatch(DropdownFieldDuck.setDelete(newProps.alias, ['entity']));
  }

  handleIncoming(e) {
    if (!isTyping) {
      insertMode = true;
      isEntity = true;
      this.props.dispatch(DropdownFieldDuck.setValueOfEntityId(this.props.entityType, e.id, this.props.alias));
    }
  }

  handleTyping(e) {
    insertMode = false;
    isTyping = true;
    isEntity = false;
    if (e) this.props.dispatch(DropdownFieldDuck.setDataForMenu(this.props.entityType, this.props.filterToCondition(e), this.props.alias));
  }

  handleDeleteFromIcon() {
    this.props.onChange(undefined);
  }

  handleOnSelect(e) {
    console.log('select');
    // isEntity = false;
    // insertMode = false;
    if (this.props.entity) this.props.dispatch(DropdownFieldDuck.setDelete(this.props.alias, ['entity']));
    this.props.dispatch(DropdownFieldDuck.setDataForMenu(this.props.entityType, this.props.filterToCondition('a'), this.props.alias));
    this.props.onChange(e.id);
  }

  handleOnBLur(e) {
    console.log('blur');
    insertMode = true;
    isTyping = false;
    if (this.props.onBlur) this.props.onBlur(e);
    if (this.props.errorText) this.props.dispatch(DropdownFieldDuck.setDelete(this.props.alias, ['errorText']));
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

  render() {
    // console.log(isEntity, this.props);
    return (
      <div id={`DropdownFieldCleverNEW_${this.props.alias}`}>
        <DropdownFieldDumb2
          alias={ this.props.alias }
          label={ this.props.label }
          data={ list }
          errorText={ this.props.errorText }
          warnText={ this.props.warnText }
          // onKeyDown={ this.handleOnKeyDown.bind(this) }
          onChange={ this.props.onChange.bind(this) }
          onSelect={ this.handleOnSelect.bind(this) }
          onBlur={ this.handleOnBLur.bind(this) }
          entityToText={ this.props.entityToText }
          entityToValue={ object => object.id }
          value={ insertMode ? this.props.value : null }
          onTyping={ this.handleTyping.bind(this) }
          filter={ item => item }
          enableDev={ true }
          entity={ this.props.entity ? this.props.entity : null }
          notIncludedInData={ this.handleIncoming.bind(this) }
          isEntity={ isEntity }
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
    entity: DropdownFieldDuck.getEntityfromId(state, props.alias),
    errorText: DropdownFieldDuck.getErrorText(state, props.alias),
  };
};

const appConnect = connect(mapStateToProps)(DropdownField);
export default appConnect;
