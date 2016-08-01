import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import AbstractAutoComplete from './AbstractAutoComplete.jsx';
import SvgIcon from 'material-ui/SvgIcon';

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
    // showMenu: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      toDisplay: ''
    };
    this.list = [];
    this.typing = false;
    this.showMenuHandler = false;
    this.notificationText = '';
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value && newProps.data && newProps.data.length === 1) {
      this.text = this.props.entityToText(newProps.data[0]);
    }
  }

  componentWillUpdate(newProps) {
    if (this.props.enableDev && !newProps.value && this.state.toDisplay === this.text && this.state.toDisplay !== '') {
      newProps.onChange(undefined)
      this.setState({toDisplay: ''});
    }
  }

  handleTyping(e) {
    if (!this.typing) this.typing = true;
    if (this.props.onTyping) this.props.onTyping(e);
    this.InMenuMode = false;
    this.showMenuHandler = true;
    if (this.typing) {
      this.setState({toDisplay: e});
    }
  }

  handleOnBlur(e) {
    if (!this.InMenuMode) {
      this.showMenuHandler = false;
      if (this.typing) this.typing = false;
      if (this.props.onBlur) this.props.onBlur(e);
      if (this.state.toDisplay != this.text) {
        if (!this.state.toDisplay) this.text = this.state.toDisplay;
        this.setState({toDisplay: this.text});
      }
    }
  }

  handleOnSelect(e) {
    if (this.typing) this.typing = false;
    setTimeout( () => { this.refs.textfield.focus() }, 0 );
    const output = this.props.entityToValue(e);
    if (this.props.onChange) this.handleOnChange(output);
    this.text = this.props.entityToText(e);
    if (this.props.onSelect) this.props.onSelect(e);
    this.InMenuMode = false;
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
      if (this.InMenuMode) this.showMenuHandler = false;
      setTimeout( () => { this.refs.textfield.focus() }, 0 );
    }
    if (e.keyCode === 40 || e.keyCode == 38) {
      this.showMenuHandler = true;
      this.InMenuMode = true;
      this.setState({});
    }
  };

  handleOnChange(e) {
    this.selectedVal = e;
    this.InMenuMode = false;
    if (this.props.onChange) this.props.onChange(e);
  }

  handleFocus(e) {
    // this.showMenuHandler = true;
    if (this.props.onFocus) this.props.onFocus(this.props);
  }

  handleMenuDisplay() {
    this.showMenuHandler = this.showMenuHandler ? this.showMenuHandler = false : this.showMenuHandler = true;
    this.InMenuMode = true;
    this.setState({});
  }

	render() {
    // if (!this.props.entity) {
      if (this.props.data && this.props.data.length > 0 && typeof(this.props.data[0]) === 'string' && !this.props.entityToText && !this.props.entityToValue) {
        this.list = this.props.data;
        const reSTR = /\b([a-záčďéěíňóřšťůúýž]+)/i;
        const resultSTR = reSTR.test(this.list.join(' '));
        if (!resultSTR) console.error("Value on props is not included in props data!");
        if (this.props.value) this.handleRenderWithInsertedValue(this.props.value);
      } else {
        let typeOfValue = [];
        const reVAL = /.*\b(?:return)\D+(?:(?:\.([a-z]+)))/i;
        //on resultVAL[1] is "key" what is suspected while entering value on props
        const resultVAL = reVAL.exec('' + this.props.entityToValue);
        this.list = this.props.data.map(entity => {
          typeOfValue.push(entity[resultVAL[1]]);
          return {...entity,
            'text': this.props.entityToText(entity)
          };
        });
        if (this.props.value && resultVAL[1] && this.props.enableDev) {
          let pom = {};
          pom[resultVAL[1]] = this.props.value;
          if (this.props.notIncludedInData) this.props.notIncludedInData(pom);
        }
        if (typeOfValue.length > 0) {
          const reTYPE = new RegExp('\\b('+ this.props.value + ')');
          const resultTYPE = reTYPE.exec(typeOfValue);
          if (this.props.value && !resultTYPE && !this.props.enableDev) {
            console.error('DropdownDumb, alias: ' + this.props.alias + ' -> Inserted type of value "' + typeof(this.props.value) + '" is not included as value-type on key: "' + resultVAL[1] + '" in props data. At this moment there is "' + this.props.data[resultVAL[1]] + '". Check data on props or inserted value.');
          }
          if ((this.props.value || this.props.value === 0) && !this.typing && this.state.toDisplay !== this.text) {
            this.props.data.forEach( obj => {
              if (this.props.value == obj[resultVAL[1]]) {
                this.handleRenderWithInsertedValue(this.props.entityToText(obj));
              }
            });
          }
        }
      }
    // }
    if (this.props.errorText || this.props.warnText) {
      if (this.props.errorText) {
        this.notificationText = this.props.errorText;
      } else {
        this.notificationText = this.props.warnText;
      }
    }
    if (!this.typing) {
      this.currentFilter = obj => obj;
    } else {
      this.props.filter ? this.currentFilter = this.props.filter : this.currentFilter = AbstractAutoComplete.fuzzyFilter;
    }
		return (
      <div id={`DropdownFieldDumb_${this.props.alias}`}>
	      <AbstractAutoComplete
		        floatingLabelText={ this.props.label }
            errorText={ this.notificationText }
            errorStyle={ this.props.errorText ? {color: CONSTANTS.COLORS.error} : {color: CONSTANTS.COLORS.warning} }
            dataSourceConfig={ {  text: 'text', value: 'text' } }
            dataSource={ this.list }
            disabled={ false }
            open={ this.showMenuHandler }
            // open={ this.props.showMenu }
            // openOnFocus={ true }
            ref='textfield'
            filter={ this.currentFilter }
            // filter={ this.props.filter ? this.props.filter : AbstractAutoComplete.fuzzyFilter }
            menuStyle = { { maxHeight: '300px' } }
            // animated = { false }
            onUpdateInput={ this.handleTyping.bind(this) }
            searchText={ this.state.toDisplay }
            onBlur={ this.handleOnBlur.bind(this) }
            onNewRequest={ this.handleOnSelect.bind(this) }
            onFocus={ this.handleFocus.bind(this) }
            onKeyDown={ this.handleOnKeyDown.bind(this) }
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
