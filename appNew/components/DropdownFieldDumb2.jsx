import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import AbstractAutoComplete from './AbstractAutoComplete.jsx';
import SvgIcon from 'material-ui/SvgIcon';
import Immutable from 'immutable';

import CONSTANTS from './CONSTANTS.jsx';

import './App.css';

const ClearIcon = (props) => (
  <SvgIcon {...props} color={ CONSTANTS.COLORS.disabled }>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </SvgIcon>
);

const MenuIcon = (props) => (
  <SvgIcon {...props} color={ CONSTANTS.COLORS.disabled }>
    <path d="M7 10l5 5 5-5z" />
  </SvgIcon>
);

function comparingStrings(data) {
  const regArr = /\b([a-záčďéěíňóřšťůúýž]+)/i;
  return regArr.test(data.join(' '));
};

function whatIsOnEtv(data, etv) {
  let typeOfValue = [];
  const reEtv = /.*\b(?:return)\D+(?:(?:\.([a-z]+)))/i;
  //on resultVAL[1] is "key" what is suspected while entering value on props
  const resultEtv = reEtv.exec('' + etv);
  if (resultEtv && resultEtv[1]) {
    return resultEtv[1];
  } else return null;
};

function dataVerify(arrOfVal, value) {
    const reVerify = new RegExp('\\b('+ value + ')');
    const resultVerify = reVerify.exec(arrOfVal);
    if (resultVerify && resultVerify[1]) {
        return resultVerify[1];
    } else return null;
};

class DropdownFieldDumb extends React.Component{

  static propTypes = {
    alias: PropTypes.string,
    label: PropTypes.string,
    data: PropTypes.array,
    errorText: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    entityToText: PropTypes.func,
    entityToValue: PropTypes.func,
    filter: PropTypes.func,
    onTyping: PropTypes.func,
    entity: PropTypes.object,
    onFocus: PropTypes.func,
    onSelect: PropTypes.func,
    onKeyDown: PropTypes.func,
    notIncludedInData: PropTypes.func,
    enableDev: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      toDisplay: ''
    };
    this.typing = false;
    this.menuShow = false;
    this.InMenuMode = false;
    this.deleteMode = false;
    this.dataForRender;
  }

  componentWillMount() {
    this.dataForRender = this.calculateDataForRedner(this.props, this.state);
    if (this.dataForRender) {
      this.computingDataIncomingOnProps(this.dataForRender, this.props, true);
    }
  }

  componentWillReceiveProps(newProps, newState) {
    this.dataForRender = this.calculateDataForRedner(newProps, this.state);
    if (this.dataForRender) {
      this.computingDataIncomingOnProps(this.dataForRender, newProps, !newProps.value ? true : null);
    }
  }

  componentWillUpdate(newProps) {
    if (newProps.value && newProps.value !== this.props.value) {
      this.dataForRender = this.calculateDataForRedner(newProps, this.state);
      if (this.dataForRender) {
        this.computingDataIncomingOnProps(this.dataForRender, newProps);
      }
    }

  }

  computingDataIncomingOnProps(dataForRender, props, willmount) {
    //deciding about inserted vale - if any
    if (!dataForRender.verified && props.enableDev) {
      let pom = {};
        pom[dataForRender.value] = props.value;
        if (props.notIncludedInData && !willmount && props.value !== this.controlledVal) {
          this.controlledVal = props.value;
          props.notIncludedInData(pom);
        } else if (this.state.toDisplay && this.state.value && !props.value) {
          this.text = '';
          this.setState({toDisplay: '', value: undefined});
        }
    } else if ((this.state.toDisplay !== this.text && props.value != this.state.value) ||
        (this.state.toDisplay === this.text && dataForRender.verified && props.value != this.state.value)) {
      let pom;
      props.data.forEach( obj => {
        if (dataForRender.verified == obj[dataForRender.value]) {
          pom = obj;
        }
      });
      this.InsertedValueFromPropsToState(props.entityToText(pom), props.value);
    }
  }

  calculateDataForRedner(props, state) {
    let output;
    //resolving string arr or arr of objects
    if (props.data && props.data.length > 0 && typeof(props.data[0]) === 'string') {
      output = resolveStrArrAsInput(props.data, props.value);
      // if (props.value && strOutput.value) this.InsertedValueFromPropsToState(props.value, props.value);
    } else {
      output = this.resolveObjArrAsInput(props, this.typing, this.text, state.toDisplay);
    }
    return {...output};
  };

  handleTyping(e) {
    this.typing = true;
    this.InMenuMode = false;
    if (this.props.onTyping) this.props.onTyping(e);
    this.setState({toDisplay: e});
  }

  handleOnBlur(e) {
    if (!this.InMenuMode) {
      if (this.props.onBlur) this.props.onBlur(e);
      this.typing = false;
      if (this.deleteMode && !this.state.toDisplay) {
        this.text = '';
      }
      this.deleteMode = false;
      this.menuShow = false;
      this.setState({toDisplay: this.text});
    }
  }

  handleOnSelect(e) {
    if (this.typing) this.typing = false;
    const output = this.props.entityToValue(e);
    if (this.props.onChange) this.handleOnChange(output);
    this.text = this.props.entityToText(e);
    if (this.props.onSelect) this.props.onSelect(e);
    this.InMenuMode = false;
    // this.setState({toDisplay: this.props.entityToText(e)});
  }

  InsertedValueFromPropsToState(text, value) {
    this.text = text;
    this.setState({
      toDisplay: text,
      value: value
    });
  }

  handleDeleteFromIcon() {
    this.handleOnChange(undefined);
    if (this.state.toDisplay && this.text ) {
      this.text = '';
      this.setState({toDisplay: ''});
    }
  }

  handleOnKeyDown(e) {
    if (this.props.onKeyDown) this.props.onKeyDown(e);
    //handle press ESC
    if (e.keyCode === 27) {
      if (this.deleteMode)  {
        this.text = '';
        this.setState({toDisplay: ''});
      } else this.setState({toDisplay: this.text});
    }
    //handle menushow on pressing arrows
    if (e.keyCode === 40 || e.keyCode == 38) {
      this.InMenuMode = true;
    }
    //handle this.deleteMode
    if (e.keyCode === 8 || e.keyCode === 46) {
      this.deleteMode = true;
    } else {
      if (this.state.toDisplay) this.deleteMode = false;
    }
  }

  handleOnChange(e) {
    this.selectedVal = e;
    this.InMenuMode = false;
    if (this.props.onChange) this.props.onChange(e);
  }

  handleShowMenu() {
    this.menuShow ? this.menuShow = false : this.menuShow = true;
    if (this.menuShow) {
      this.setState({});
    } else {
      this.typing = false;
      this.setState({});
    }
  }

  resolveStrArrAsInput(data, value) {
      const resultSTR = compareString(data);
      let verificationOfData = dataVerify(data, props.value);
      if (!resultSTR && value) console.error("Value on props is not included in props data!");
      return { data, value: value && resultSTR ? value : null,   verified: verificationOfData };
  }

  resolveObjArrAsInput(props) {
    let typeOfValue = [];
    let list;
    const resultEtv = whatIsOnEtv(props.data, props.entityToValue);
    if (!resultEtv) {
      console.error(`resultEtv does not exist in ${props.alias}`);
    } else {
      list = props.data.map(entity => {
        typeOfValue.push(entity[resultEtv]);
        return {...entity,
          'text': props.entityToText(entity)
        };
      });
    }
    let verificationOfData = dataVerify(typeOfValue, props.value);
    if (!props.enableDev && !verificationOfData) {
      console.error('DropdownDumb, alias: ' + props.alias + ' -> Inserted type of value "' + typeof(props.value) + '" is not included as value-type.');
    } else {
      return { data: list, value: resultEtv, verified: verificationOfData };
    }
  }

	render() {
    const { data } = this.dataForRender;
    let currentFilter;
    if (this.props.filter) {
      currentFilter = this.props.filter;
    } else if (this.typing && !this.menuShow) {
      currentFilter = AbstractAutoComplete.fuzzyFilter;
    } else {
      currentFilter = AbstractAutoComplete.noFilter;
    }

		return (
      <div id={`DropdownFieldDumb_${this.props.alias}`}>
	      <AbstractAutoComplete
		        floatingLabelText={ this.props.label }
            errorText={ this.props.errorText || this.props.warnText }
            errorStyle={ this.props.errorText ? {color: CONSTANTS.COLORS.error} : {color: CONSTANTS.COLORS.warning} }
            dataSourceConfig={ {  text: 'text', value: 'text' } }
            dataSource={ data }
            disabled={ false }
            open={ this.menuShow }
            ref={ `DropdownFieldDumb_${this.props.alias}` }
            filter={ currentFilter }
            menuStyle = { { maxHeight: '300px' } }
            onUpdateInput={ this.handleTyping.bind(this) }
            searchText={ this.state.toDisplay }
            onBlur={ this.handleOnBlur.bind(this) }
            onNewRequest={ this.handleOnSelect.bind(this) }
            onFocus={ this.props.onFocus ? this.props.onFocus(this) : () => {} }
            onKeyDown={ this.handleOnKeyDown.bind(this) }
            menuProps={ { onKeyDown: this.handleOnKeyDown.bind(this), onBlur: this.handleOnBlur.bind(this) } }
            menuCloseDelay={ 0 }
            mode={ this.state.mode }
	      />
        <ClearIcon
          style={ CONSTANTS.COMPONENT_ICONS_INLINE_STYLE.second }
          visibility={ this.text ? 'visible' : 'hidden' }
          hoverColor={ CONSTANTS.COLORS.normal }
          onClick={ this.handleDeleteFromIcon.bind(this) }
        />
      {/*}<MenuIcon
          style={ CONSTANTS.COMPONENT_ICONS_INLINE_STYLE.first }
          hoverColor={ CONSTANTS.COLORS.normal }
          onClick={ this.handleShowMenu.bind(this) }
        />*/}
      </div>
		);
	};

};

export default DropdownFieldDumb;
