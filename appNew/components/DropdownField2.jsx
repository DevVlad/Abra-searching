import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DropdownFieldDumb2 from './DropdownFieldDumb2.jsx';
import SvgIcon from 'material-ui/SvgIcon';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import AbstractAutoComplete from './AbstractAutoComplete.jsx';
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
    this.state = {
      list: []
    };
  }

  shouldComponentUpdate(newProps, nextState) {
    if ((newProps.data !== this.props.data && newProps.data.size > 0) ||
    (newProps.value && newProps.value !== this.props.value) ||
    (newProps.entity && this.state.list[0] !== newProps.entity) ||
    (!newProps.value && this.props.value) ||
    (this.props.errorText !== newProps.errorText || this.props.errorTextLocale !== newProps.errorTextLocale ) ||
    (this.props.warnText !== newProps.warnText) ||
    (!Immutable.is(Immutable.fromJS(nextState.list), Immutable.fromJS(this.state.list)))
    ) {
      return true;
    } else {
      return false;
    }
  }

  componentWillUpdate(newProps) {
    if (newProps.entity) {
      let list = [];
      list.push(newProps.entity);
      this.setState({list});
      this.props.dispatch(DropdownFieldDuck.setDataForMenu(this.props.entityType, this.props.filterToCondition('a'), this.props.alias));
    } else if (newProps.data && !Immutable.is(Immutable.fromJS(this.props.data), Immutable.fromJS(newProps.data))) {
      this.setState({list: newProps.data.toJS()});
    }
  }

  componentWillReceiveProps(newProps, newState) {
    if (newProps.errorTextLocale !== this.props.errorTextLocale || newProps.errorText !== this.props.errorText) {
      if (!newProps.errorText && !newProps.errorTextLocale) this.props.dispatch(DropdownFieldDuck.setDataForMenu(this.props.entityType, this.props.filterToCondition('a'), this.props.alias));
    }
    if (newProps.warnText !== this.props.warnText) {
      if (!newProps.errorText) this.props.dispatch(DropdownFieldDuck.setDataForMenu(this.props.entityType, this.props.filterToCondition('a'), this.props.alias));
    }
  }

  handleIncoming(e) {
    if (e.id) {
      this.props.dispatch(DropdownFieldDuck.setValueOfEntityId(this.props.entityType, e.id, this.props.alias));
    }
  }

  handleTyping(e) {
    if (e && e!== 'a') this.props.dispatch(DropdownFieldDuck.setDataForMenu(this.props.entityType, this.props.filterToCondition(e), this.props.alias));
  }

  handleOnSelect(e) {
    this.props.onChange(e.id);
    if (this.props.filter !== 'a') {
      this.props.dispatch(DropdownFieldDuck.setDataForMenu(this.props.entityType, this.props.filterToCondition('a'), this.props.alias));
    }
  }

  handleOnBLur(e) {
    if (this.props.errorTextLocale) this.props.dispatch(DropdownFieldDuck.setErrorMessage(this.props.alias, undefined));
    if (this.props.onBlur) this.props.onBlur(e);
  }

  menuShouldAppear(e) {
    if (e === true) {
      this.props.dispatch(DropdownFieldDuck.setDataForMenu(this.props.entityType, this.props.filterToCondition('a'), this.props.alias));
    }
  }

  render() {
    return (
      <div id={`DropdownFieldCleverNEW_${this.props.alias}`}>
        <DropdownFieldDumb2
          alias={ this.props.alias }
          label={ this.props.label }
          data={ this.state.list }
          errorText={ this.props.errorText ? this.props.errorText : this.props.errorTextLocale }
          warnText={ this.props.warnText }
          onChange={ this.props.onChange.bind(this) }
          onSelect={ this.handleOnSelect.bind(this) }
          onBlur={ this.handleOnBLur.bind(this) }
          entityToText={ this.props.entityToText }
          entityToValue={ object => object.id }
          value={ this.props.value }
          onTyping={ this.handleTyping.bind(this) }
          filter={ AbstractAutoComplete.noFilter }
          enableDev={ true }
          entity={ this.props.entity ? this.props.entity : null }
          notIncludedInData={ this.handleIncoming.bind(this) }
          menuShouldAppear={ this.menuShouldAppear.bind(this) }
          />
      </div>
    );
  };

};

function mapStateToProps(state, props) {
  return {...props,
    filter: DropdownFieldDuck.getFilter(state, props.alias),
    data: DropdownFieldDuck.getData(state, props.alias),
    // loading: DropdownFieldDuck.getLoading(state, props.alias),
    entity: DropdownFieldDuck.getEntityfromId(state, props.alias),
    errorTextLocale: DropdownFieldDuck.getErrorText(state, props.alias),
  };
};

const appConnect = connect(mapStateToProps)(DropdownField);
export default appConnect;
