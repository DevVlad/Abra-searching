import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DropdownFieldDumb from './DropdownFieldDumb.jsx';
import SvgIcon from 'material-ui/SvgIcon';
import RefreshIndicator from 'material-ui/RefreshIndicator';

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
    loadingNotify: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      toDisplay: ''
    };
    this.initDataFotInitId = [];
  }

  componentWillMount() {
    if (this.props.entityId) {
      this.props.dispatch(DropdownFieldDuck.setValueOfEntityId(this.props.entityType, this.props.entityId, this.props.alias));
    }
  }

  componentWillUpdate(newProps) {

    if (parseInt(newProps.entityIdIsThis.id) === newProps.entityId && !newProps.data) {
      this.initDataFotInitId.push(newProps.entityIdIsThis);
    }

    //   const resultEntity = newProps.entityIdIsThis;
    //   const whatToDispl = newProps.entityToText(resultEntity);
    //   if (whatToDispl != this.state.toDisplay) {
    //     console.log(whatToDispl);
    //     this.setState({toDisplay: whatToDispl});
    //   }
  // } else if (parseInt(newProps.entityIdIsThis.id) !== newProps.entityId) this.props.dispatch(DropdownFieldDuck.setValueOfEntityId(this.props.entityType, this.props.entityId, this.props.alias));

  }

  handleOnChange(e) {
    this.props.onChange(e);
  }

  handleOnBLur(e) {
    this.props.onBlur(e);
  }

  handleTyping(e) {
    if (e) {
      this.props.dispatch(DropdownFieldDuck.setData(this.props.entityType, this.props.filterToCondition(e), this.props.alias));
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
          data={ this.props.data ? this.props.data.toJS() : this.initDataFotInitId}
          errorText={ this.props.errorText }
          warnText={ this.props.warnText }
          onChange={ this.handleOnChange.bind(this) }
          onBlur={ this.handleOnBLur.bind(this) }
          entityToText={ this.props.entityToText }
          entityToValue={ object => object.id }
          value={ this.props.entityIdIsThis || this.props.data ? this.props.entityId : null }
          onTyping={ this.handleTyping.bind(this) }
          filter={ item => item }
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
    entityIdIsThis: DropdownFieldDuck.getEntityfromId(state, props.alias)
  };
};

const appConnect = connect(mapStateToProps)(DropdownField);
export default appConnect;
