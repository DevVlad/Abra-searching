import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DropdownFieldDumb2 from './DropdownFieldDumb2.jsx';
import SvgIcon from 'material-ui/SvgIcon';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import AbstractAutoComplete from './AbstractAutoComplete.jsx';
import Immutable from 'immutable';
import _ from 'lodash';

import DropdownFieldDuck from '../redux/ducks/dropdownfieldDuck.jsx';

import CONSTANTS from './CONSTANTS.jsx';

import './App.css';

const AddIcon = (props) => (
  <SvgIcon {...props} color={ CONSTANTS.COLORS.disabled }>
    <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
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
    allowNew: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }

  shouldComponentUpdate(newProps, nextState) {
    if ((newProps.data !== this.props.data && newProps.data.size > 0) ||
    (!newProps.data && this.props.data) ||
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
    } else if (newProps.data && !Immutable.is(Immutable.fromJS(this.props.data), Immutable.fromJS(newProps.data))) {
      this.setState({list: newProps.data.toJS()});
    } else if (newProps.errorText || newProps.errorTextLocale) {
      this.setState({list: newProps.data ? newProps.data.toJS() : []});
      if (newProps.data.size > 0) this.props.dispatch(DropdownFieldDuck.setErrorMessage(this.props.alias, undefined));
    }
  }

  handleIncoming(e) {
    if (e.id) {
      this.props.dispatch(DropdownFieldDuck.setValueOfEntityId(this.props.entityType, e.id, this.props.alias));
    }
  }

  handleTyping(e) {
    this.pom = e;
    setTimeout(() => {
      if (e === this.pom && !this.props.errorText) {
        this.props.dispatch(DropdownFieldDuck.setDataForMenu(this.props.entityType, this.props.filterToCondition(e), this.props.alias));
      }
    }, 150);
  }

  handleOnSelect(e) {
    this.props.onChange(e.id);
    this.props.dispatch(DropdownFieldDuck.setDelete(this.props.alias, ['data']));
  }

  handleOnBlur(e) {
    if (this.props.errorTextLocale) this.props.dispatch(DropdownFieldDuck.setErrorMessage(this.props.alias, undefined));
    this.props.dispatch(DropdownFieldDuck.setDelete(this.props.alias, ['data']));
    if (this.props.onBlur) this.props.onBlur(e);
  }

  menuShouldAppear(e, icon) {
    if (icon) alert('Icon for something bigger!');
  }

  render() {
    let localNtf = {};
    if (this.props.errorTextLocale && !this.props.warnText && !this.props.errorText) {
      if (this.props.allowNew) {
        localNtf = {
          text: `${this.props.errorTextLocale} Do You want to create the record in database?`,
          color: CONSTANTS.COLORS.pass
        };
      } else {
        localNtf = {
          text: this.props.errorTextLocale,
          color: CONSTANTS.COLORS.error
        };
      }
    }

    return (
      <div id={`DropdownFieldCleverNEW_${this.props.alias}`}>
        <DropdownFieldDumb2
          alias={ this.props.alias }
          label={ this.props.label }
          data={ this.state.list }
          localeError={ localNtf }
          errorText={ this.props.errorText }
          warnText={ this.props.warnText }
          onChange={ this.props.onChange.bind(this) }
          onSelect={ this.handleOnSelect.bind(this) }
          onBlur={ this.handleOnBlur.bind(this) }
          entityToText={ this.props.entityToText }
          entityToValue={ object => object.id }
          value={ this.props.value }
          onTyping={ this.handleTyping.bind(this) }
          filter={ AbstractAutoComplete.noFilter }
          enableDev={ true }
          entity={ this.props.entity ? this.props.entity : null }
          notIncludedInData={ this.handleIncoming.bind(this) }
          menuShouldAppear={ this.menuShouldAppear.bind(this) }
          cleverExt={ true }
          />
        <AddIcon
          style={ {...CONSTANTS.COMPONENT_ICONS_INLINE_STYLE.second, transform: this.props.value ? 'translate(+200px, -62px)' : 'translate(+215px, -60px)'} }
          visibility={ this.props.errorTextLocale && !this.props.errorText && !this.props.warnText && this.props.allowNew ? 'visible' : 'hidden' }
          hoverColor={ CONSTANTS.COLORS.pass }
          onClick={ () => alert('Add to database.') }
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
