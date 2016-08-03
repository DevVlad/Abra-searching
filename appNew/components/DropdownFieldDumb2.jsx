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

let notificationText;
let list = [];
let typing = false;
let menuShow = false;
let currentFilter;
let InMenuMode = false;
let deleteMode = false;

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
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value && newProps.data && newProps.data.length === 1) {
      this.text = this.props.entityToText(newProps.data[0]);
    }
  }

  componentWillUpdate(newProps) {
    if (this.props.enableDev && !newProps.value && this.state.toDisplay === this.text && this.state.toDisplay !== '') {
      if (newProps.onChange) newProps.onChange(undefined)
      this.setState({toDisplay: ''});
    }

  }

  handleTyping(e) {
    if (!typing) typing = true;
    if (this.props.onTyping) this.props.onTyping(e);
    InMenuMode = false;
    // menuShow = true;
    if (typing) {
      this.setState({toDisplay: e});
    }
  }

  handleOnBlur(e) {
    typing = false;
    if (this.props.onBlur) this.props.onBlur(e);
    if (!InMenuMode) {
      menuShow = false;
      if (deleteMode && !this.state.toDisplay) this.text = '';
      this.setState({toDisplay: this.text});
    }
    // if (!InMenuMode) {
    //   if (typing) typing = false;
    //   if (this.props.onBlur) this.props.onBlur(e);
    //   if (menuShow) {
    //     menuShow = false;
    //   } else if (this.state.toDisplay != this.text) {
    //     if (!this.state.toDisplay) this.text = this.state.toDisplay;
    //   }
    //   this.setState({toDisplay: this.text});
    // } //else menuShow = false;
  }

  handleOnSelect(e) {
    setTimeout( () => { this.refs.textfieldDumb.focus() }, 0 );
    if (typing) typing = false;
    const output = this.props.entityToValue(e);
    if (this.props.onChange) this.handleOnChange(output);
    this.text = this.props.entityToText(e);
    if (this.props.onSelect) this.props.onSelect(e);
    InMenuMode = false;
    this.setState({toDisplay: this.props.entityToText(e)});
  }

  handleRenderWithInsertedValue(val) {
    this.text = val;
    setTimeout( () => {
      this.setState({toDisplay: val});
    }, 0);
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
      if (InMenuMode) menuShow = false;
      setTimeout( () => { this.refs.textfieldDumb.focus() }, 0 );
      if (deleteMode)  {
        this.text = '';
        this.setState({toDisplay: ''});
      } else this.setState({toDisplay: this.text});
    }
    //handle menushow on pressing arrows
    if (e.keyCode === 40 || e.keyCode == 38) {
      menuShow = true;
      InMenuMode = true;
    }
    //handle deleteMode
    if (e.keyCode === 8 || e.keyCode === 46) {
      deleteMode = true;
    } else {
      if (this.state.toDisplay) deleteMode = false;
    }
  }

  handleOnChange(e) {
    this.selectedVal = e;
    InMenuMode = false;
    if (this.props.onChange) this.props.onChange(e);
  }

  handleMenuDisplay() {
    menuShow ? menuShow = false : menuShow = true;
    if (menuShow) {
      // InMenuMode = true;
      typing = true;
      setTimeout( () => { this.refs.textfieldDumb.focus() }, 0 );
      this.setState({toDisplay: ''});
    } else {
      typing = false;
      // InMenuMode = false;
      this.setState({toDisplay: this.text});
    }
  }

  preRenderMethod() {
    if (this.props.data && this.props.data.length > 0 && typeof(this.props.data[0]) === 'string' && !this.props.entityToText && !this.props.entityToValue) {
      list = this.props.data;
      const reSTR = /\b([a-záčďéěíňóřšťůúýž]+)/i;
      const resultSTR = reSTR.test(list.join(' '));
      if (!resultSTR) console.error("Value on props is not included in props data!");
      if (this.props.value) this.handleRenderWithInsertedValue(this.props.value);
    } else {
      let typeOfValue = [];
      const reVAL = /.*\b(?:return)\D+(?:(?:\.([a-z]+)))/i;
      //on resultVAL[1] is "key" what is suspected while entering value on props
      const resultVAL = reVAL.exec('' + this.props.entityToValue);
      list = this.props.data.map(entity => {
        typeOfValue.push(entity[resultVAL[1]]);
        return {...entity,
          'text': this.props.entityToText(entity)
        };
      });
      if (typeOfValue.length > 0) {
        const reTYPE = new RegExp('\\b('+ this.props.value + ')');
        const resultTYPE = reTYPE.exec(typeOfValue);
        if (this.props.value && !resultTYPE && !this.props.enableDev) {
          console.error('DropdownDumb, alias: ' + this.props.alias + ' -> Inserted type of value "' + typeof(this.props.value) + '" is not included as value-type on key: "' + resultVAL[1] + '" in props data. At this moment there is "' + this.props.data[resultVAL[1]] + '". Check data on props or inserted value.');
        }
        if ((this.props.value || this.props.value === 0) && !typing && this.state.toDisplay !== this.text) {
          this.props.data.forEach( obj => {
            if (this.props.value == obj[resultVAL[1]]) {
              this.handleRenderWithInsertedValue(this.props.entityToText(obj));
            }
          });
        }
      }
      const reISTHERE = new RegExp('\\b('+ this.props.value + ')');
      const resultISTHERE = reISTHERE.exec(typeOfValue);
      if (!resultISTHERE && this.props.value && this.props.isEntity) {
        let pom = {};
        pom[resultVAL[1]] = this.props.value;
        if (this.props.notIncludedInData) {
          this.props.notIncludedInData(pom);
        } else console.error('Inserted value ${pom} is not known value!');
      }
    }
    if (this.props.errorText || this.props.warnText) {
      if (this.props.errorText) {
        notificationText = this.props.errorText;
      } else {
        notificationText = this.props.warnText;
      }
    } else {
      notificationText = undefined;
    }
    if (this.props.filter) {
      currentFilter = this.props.filter;
    } else if (typing) {
      currentFilter = AbstractAutoComplete.fuzzyFilter;
    } else {
      currentFilter = AbstractAutoComplete.noFilter;
    }
    // if (!this.state.toDisplay || !typing) {
    //   this.currentFilter = AbstractAutoComplete.noFilter;
    // } else {
    //   this.props.filter ? this.currentFilter = this.props.filter : this.currentFilter = AbstractAutoComplete.fuzzyFilter;
    // }
  }

	render() {
    this.preRenderMethod();
    if (list.length > 0) console.log(`DropdownFieldDumb_${this.props.alias}`,list);
		return (
      <div id={`DropdownFieldDumb_${this.props.alias}`}>
	      <AbstractAutoComplete
		        floatingLabelText={ this.props.label }
            errorText={ notificationText }
            errorStyle={ this.props.errorText ? {color: CONSTANTS.COLORS.error} : {color: CONSTANTS.COLORS.warning} }
            dataSourceConfig={ {  text: 'text', value: 'text' } }
            dataSource={ list }
            disabled={ false }
            open={ menuShow }
            ref='textfieldDumb'
            filter={ currentFilter }
            menuStyle = { { maxHeight: '300px' } }
            onUpdateInput={ this.handleTyping.bind(this) }
            searchText={ this.state.toDisplay }
            onBlur={ this.handleOnBlur.bind(this) }
            onNewRequest={ this.handleOnSelect.bind(this) }
            onFocus={ this.props.onFocus ? this.props.onFocus(this) : () => {} }
            onKeyDown={ this.handleOnKeyDown.bind(this) }
            onClick={ this.handleMenuDisplay.bind(this) }
            menuProps={ { onKeyDown: this.handleOnKeyDown.bind(this), onBlur: this.handleOnBlur.bind(this) } }
	      />
        <ClearIcon
          style={ CONSTANTS.COMPONENT_ICONS_INLINE_STYLE.second }
          visibility={ this.state.toDisplay ? 'visible' : 'hidden' }
          hoverColor={ CONSTANTS.COLORS.normal }
          onClick={ this.handleDeleteFromIcon.bind(this) }
        />
      <MenuIcon
          style={ CONSTANTS.COMPONENT_ICONS_INLINE_STYLE.first }
          hoverColor={ CONSTANTS.COLORS.normal }
          onClick={ this.handleMenuDisplay.bind(this) }
        />
      </div>
		);
	};

};

export default DropdownFieldDumb;
