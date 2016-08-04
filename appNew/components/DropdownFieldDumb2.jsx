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

function comparingStrings(arr) {
  const regArr = /\b([a-záčďéěíňóřšťůúýž]+)/i;
  return regArr.test(arr.join(' '));
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

function dataVerify(arrOfVal, value, alias) {
  if (arrOfVal.length > 0) {
    const reVerify = new RegExp('\\b('+ value + ')');
    const resultVerify = reVerify.exec(arrOfVal);
    if (!resultVerify) {
      return false;
    } else {
      return true;
    }
  }
};

function verifyKnownData(arrOfVal, value) {
  const reKnown = new RegExp('\\b('+ value + ')');
  const resultKnown = reKnown.exec(arrOfVal);
  if (resultKnown && resultKnown[1]) {
    return resultKnown[1];
  } else return null;
};

function resolveStringArrAsInput(data, value) {
    const resultSTR = compareString(data);
    if (!resultSTR && value) console.error("Value on props is not included in props data!");
    let output = {
      data,
      value: value && resultSTR ? value : null,
    };
    return output;
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
    menuToggled: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      toDisplay: ''
    };
    // this.notificationText;
    // this.list = [];
    this.typing = false;
    this.menuShow = false;
    // this.currentFilter;
    this.InMenuMode = false;
    this.deleteMode = false;
    this.dataForRender;
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value && newProps.data && newProps.data.length === 1) {
      this.text = this.props.entityToText(newProps.data[0]);
    } else if (newProps.value) {
      this.text = '';
    } else if (!newProps.value && this.props.onChange) this.setState({toDisplay: ''});
  }

  componentWillMount() {
      this.dataForRender = this.calculateDataForRedner(this.props, this.state);
      this.handleComputedDataBeforeRender(this.dataForRender);
  }

  handleComputedDataBeforeRender(dataForRender) {
    //deciding about inserted vale - if any
    if (!dataForRender.output.verified && this.props.enableDev) {
      let pom = {};
        pom[dataForRender.output.value] = dataForRender.output.verified;
        if (this.props.notIncludedInData) {
          this.props.notIncludedInData(pom);
        }
    } else if (this.state.toDisplay !== this.text) {
      let pom;
      this.props.data.forEach( obj => {
        if (dataForRender.output.verified == obj[dataForRender.output.value]) {
          pom = obj;
        }
      });
      this.handleRenderWithInsertedValue(this.props.entityToText(pom));
    }
  }

  calculateDataForRedner(props, state) {
    let data;
    let notificationText;
    let currentFilter;
    let output;
    //resolving string arr or arr of objects
    if (props.data && props.data.length > 0 && typeof(props.data[0]) === 'string' && !props.entityToText && !props.entityToValue) {
      output = resolveStringArrAsInput(props.data, props.value);
      if (props.value && strOutput.value) this.handleRenderWithInsertedValue(props.value);
    } else {
      output = this.resolveObjArrAsInput(props, this.typing, this.text, state.toDisplay);

    }
    if (props.errorText || props.warnText) {
      if (props.errorText) {
        notificationText = props.errorText;
      } else {
        notificationText = props.warnText;
      }
    } else {
      notificationText = undefined;
    }
    if (props.filter) {
      currentFilter = props.filter;
    } else if (this.typing && !this.menuShow) {
      currentFilter = AbstractAutoComplete.fuzzyFilter;
    } else {
      currentFilter = AbstractAutoComplete.noFilter;
    }
    return { output, notificationText, currentFilter };
  };

  handleTyping(e) {
    if (!this.typing) this.typing = true;
    if (this.props.onTyping) this.props.onTyping(e);
    this.InMenuMode = false;
    if (this.typing) {
      this.setState({toDisplay: e});
    }
  }

  handleOnBlur(e) {
    this.typing = false;
    if (!this.InMenuMode) {
      if (this.deleteMode && !this.state.toDisplay) this.text = '';
      if (this.props.onBlur) this.props.onBlur(e);

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
    setTimeout( () => { this.refs[`DropdownFieldDumb_${this.props.alias}`].focus() }, 0 );
    this.setState({toDisplay: this.props.entityToText(e)});
  }

  handleRenderWithInsertedValue(text) {
    this.text = text;
    this.setState({toDisplay: text});
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

  handleMenuDisplay() {
    this.menuShow ? this.menuShow = false : this.menuShow = true;
    if (this.props.menuToggled) this.props.menuToggled(this.menuShow);
    if (this.menuShow) {
      // setTimeout( () => { this.refs[`DropdownFieldDumb_${this.props.alias}`].focus() }, 0 );
      this.setState({});
    } else {
      this.typing = false;
      this.setState({});
      // this.setState({toDisplay: this.text});
    }
  }

  resolveObjArrAsInput() {
    let typeOfValue = [];
    let pom = {};
    let list;
    const resultEtv = whatIsOnEtv(this.props.data, this.props.entityToValue);
    if (!resultEtv) {
      console.error(`resultEtv does not exist in ${this.props.alias}`);
    } else {
      list = this.props.data.map(entity => {
        typeOfValue.push(entity[resultEtv]);
        return {...entity,
          'text': this.props.entityToText(entity)
        };
      });
    }
    let verificationOfData = dataVerify(typeOfValue, this.props.value, this.props.alias);
    if (!this.props.enableDev && !verificationOfData) {
      console.error('DropdownDumb, alias: ' + this.props.alias + ' -> Inserted type of value "' + typeof(prop.value) + '" is not included as value-type.');
    } else {
      const isValueInData = verifyKnownData(typeOfValue, this.props.value);
      return {data: list, value: resultEtv, verified: isValueInData};
    }
  }

  // calculateDataForRedner() {
  //   let data;
  //   let notificationText;
  //   let currentFilter;
  //   let output;
  //   //resolving string arr or arr of objects
  //   if (this.props.data && this.props.data.length > 0 && typeof(this.props.data[0]) === 'string' && !this.props.entityToText && !this.props.entityToValue) {
  //     output = resolveStringArrAsInput(this.props.data, this.props.value);
  //     if (this.props.value && strOutput.value) this.handleRenderWithInsertedValue(this.props.value);
  //   } else {
  //     output = this.resolveObjArrAsInput(this.props, this.typing, this.text, this.state.toDisplay);
  //
  //   }
  //   if (this.props.errorText || this.props.warnText) {
  //     if (this.props.errorText) {
  //       notificationText = this.props.errorText;
  //     } else {
  //       notificationText = this.props.warnText;
  //     }
  //   } else {
  //     notificationText = undefined;
  //   }
  //   if (this.props.filter) {
  //     currentFilter = this.props.filter;
  //   } else if (this.typing && !this.menuShow) {
  //     currentFilter = AbstractAutoComplete.fuzzyFilter;
  //   } else {
  //     currentFilter = AbstractAutoComplete.noFilter;
  //   }
  //   return { output, notificationText, currentFilter };
  // };

	render() {
    // const dataForRender = this.calculateDataForRedner();
    const { notificationText, currentFilter } = this.dataForRender;
    const { data } = this.dataForRender.output;
    // //deciding about inserted vale - if any
    // if (!dataForRender.output.verified && this.props.enableDev) {
    //   let pom = {};
    //     pom[dataForRender.output.value] = dataForRender.output.verified;
    //     if (this.props.notIncludedInData) {
    //       this.props.notIncludedInData(pom);
    //     }
    // } else if (this.state.toDisplay !== this.text) {
    //   let pom;
    //   this.props.data.forEach( obj => {
    //     if (dataForRender.output.verified == obj[dataForRender.output.value]) {
    //       pom = obj;
    //     }
    //   });
    //   this.handleRenderWithInsertedValue(this.props.entityToText(pom));
    // }

    // if (!objOutput.verified && this.props.value && this.props.isEntity) {
    //   let pom = {};
    //   pom[objOutput.value] = this.props.value;
    //   if (this.props.notIncludedInData) {
    //     this.props.notIncludedInData(pom);
    //   } else console.error(`Inserted value ${pom} is not known value!`);
    // } else if ((this.props.value || this.props.value === 0) && !this.typing && (this.state.toDisplay !== this.text )) {
    //   this.props.data.forEach( obj => {
    //     if (this.props.value == obj[objOutput.value]) {
    //       this.handleRenderWithInsertedValue(this.props.entityToText(obj));
    //     }
    //   });
    // }
		return (
      <div id={`DropdownFieldDumb_${this.props.alias}`}>
	      <AbstractAutoComplete
		        floatingLabelText={ this.props.label }
            errorText={ notificationText }
            errorStyle={ this.props.errorText ? {color: CONSTANTS.COLORS.error} : {color: CONSTANTS.COLORS.warning} }
            dataSourceConfig={ {  text: 'text', value: 'text' } }
            dataSource={ data }
            disabled={ false }
            open={ this.menuShow }
            ref={`DropdownFieldDumb_${this.props.alias}`}
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
