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
      toDisplay: '',
      typing: false,
      menuShow: false,
      InMenuMode: false,
      dataForRender: {},
      controlledVal: undefined,
    };
  }

  componentWillMount() {
    let dataForRender = this.calculateDataForRedner(this.props, this.state);
    if (dataForRender) {
      this.computingDataIncomingOnProps(dataForRender, this.props, true);
      this.setState({dataForRender});
    }
  }

  componentWillReceiveProps(newProps, newState) {
    let dataForRender = this.calculateDataForRedner(newProps, this.state);
    if (dataForRender) {
      this.computingDataIncomingOnProps(dataForRender, newProps, !newProps.value ? true : null);
      this.setState({dataForRender});
    }
  }

  componentWillUpdate(newProps) {
    if (newProps.value && newProps.value !== this.props.value) {
      let dataForRender = this.calculateDataForRedner(newProps, this.state);
      if (dataForRender) {
        this.computingDataIncomingOnProps(dataForRender, newProps);
        this.setState({dataForRender});
      }
    }

  }

  computingDataIncomingOnProps(dataForRender, props, willmount) {
    //deciding about inserted vale - if any
    if (!dataForRender.verified && props.enableDev) {
      let pom = {};
        pom[dataForRender.value] = props.value;
        if (props.notIncludedInData && !willmount && props.value !== this.state.controlledVal && !this.state.typing) {
          props.notIncludedInData(pom);
          this.setState({controlledVal: props.value});
        } else if (this.state.toDisplay && this.state.value && !props.value) {
          this.setState({toDisplay: '', value: undefined, text: ''});
        }
    } else if ((this.state.toDisplay !== this.state.text && props.value != this.state.value) ||
        (this.state.toDisplay === this.state.text && dataForRender.verified && props.value != this.state.value)) {
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
    } else {
      output = this.resolveObjArrAsInput(props, state.typing, state.text, state.toDisplay);
    }
    return {...output};
  };

  handleTyping(e) {
    if (this.props.onTyping) this.props.onTyping(e);
    this.setState({
      toDisplay: e,
      typing: true,
      InMenuMode: false,
    });
  }

  handleOnBlur(e) {
    let toState, toText;
    if (!this.state.InMenuMode) {
      toState = this.state.deleteMode && !this.state.toDisplay ? '' : this.state.text;
      toText = toState;
    } else {
      toState = this.props.value ? this.state.text : '';
      toText = this.state.text;
    }
    if (this.props.onBlur) this.props.onBlur(e);
    this.setState({
      toDisplay: toState,
      text: toText,
      deleteMode: false,
      menuShow: false,
      typing: false,
    });
  }

  handleOnSelect(e) {
    const output = this.props.entityToValue(e);
    if (this.props.onChange) this.handleOnChange(output);
    if (this.props.onSelect) this.props.onSelect(e);
    this.setState({
      typing: false,
      InMenuMode: false,
      text: this.props.entityToText(e),
      toDisplay: this.props.entityToText(e)
    });
  }

  InsertedValueFromPropsToState(text, value) {
    this.setState({
      toDisplay: text,
      value: value,
      text
    });
  }

  handleDeleteFromIcon() {
    this.handleOnChange(undefined);
    if (this.state.toDisplay && this.state.text ) {
      this.setState({
        toDisplay: '',
        text: '',
      });
    }
  }

  handleOnKeyDown(e) {
    if (this.props.onKeyDown) this.props.onKeyDown(e);
    //handle press ESC
    if (e.keyCode === 27) {
      if (this.state.deleteMode)  {
        this.setState({
          toDisplay: '',
          text: '',
        });
      } else this.setState({toDisplay: this.state.toDisplay});
    }
    //handle menushow on pressing arrows
    if (e.keyCode === 40 || e.keyCode == 38) {
      if (!this.state.InMenuMode) {
        this.setState({InMenuMode: true});
      }
    }
    //handle this.deleteMode
    if (e.keyCode === 8 || e.keyCode === 46) {
      if (!this.state.deleteMode) this.setState({deleteMode: true});
    } else {
      if (this.state.toDisplay) this.setState({deleteMode: false});
    }
  }

  handleOnKeyDownMenu(e) {
    if (e.keyCode === 27) {
      if (this.state.deleteMode)  {
        this.setState({
          toDisplay: '',
          text: '',
        });
      } else this.setState({toDisplay: this.state.toDisplay});
    }
  }

  handleOnChange(e) {
    this.setState({InMenuMode: false});
    if (this.props.onChange) this.props.onChange(e);
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
      console.error(`Wrong entity to value or wrong data inserted in: ${props.alias}!`);
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
    const { data } = this.state.dataForRender;
    let currentFilter;
    if (this.props.filter) {
      currentFilter = this.props.filter;
    } else if (this.state.typing && !this.state.menuShow) {
      currentFilter = AbstractAutoComplete.fuzzyFilter;
    } else {
      currentFilter = AbstractAutoComplete.noFilter;
    }

    let color;
    let errFromParent;
    if (this.props.errorText) {
      color = CONSTANTS.COLORS.error;
    } else if (this.props.warnText) {
      color = CONSTANTS.COLORS.warning;
    } else if (this.props.localeError) {
      color = this.props.localeError.color;
      errFromParent = this.props.localeError.text;
    }

		return (
      <div id={`DropdownFieldDumb_${this.props.alias}`}>
	      <AbstractAutoComplete
		        floatingLabelText={ this.props.label }
            errorText={ this.props.errorText || this.props.warnText || errFromParent }
            errorStyle={ {color: color} }
            dataSourceConfig={ {  text: 'text', value: 'text' } }
            dataSource={ data }
            disabled={ false }
            open={ this.state.menuShow }
            ref={ `DropdownFieldDumb_${this.props.alias}` }
            filter={ currentFilter }
            menuStyle = { { maxHeight: '300px' } }
            onUpdateInput={ this.handleTyping.bind(this) }
            searchText={ this.state.toDisplay }
            onBlur={ this.handleOnBlur.bind(this) }
            onNewRequest={ this.handleOnSelect.bind(this) }
            onFocus={ this.props.onFocus ? this.props.onFocus(this) : () => {} }
            onKeyDown={ this.handleOnKeyDown.bind(this) }
            menuCloseDelay={ 0 }
            modeTyping={ this.state.typing }
            menuShouldAppear={ this.props.menuShouldAppear ? this.props.menuShouldAppear.bind(this) : undefined }
            menuProps={ {
              onKeyDown: this.handleOnKeyDownMenu.bind(this)
            } }
            enableDev={ this.props.enableDev ? this.props.enableDev : false}
            cleverExt={ this.props.cleverExt }
	      />
        <ClearIcon
          style={ this.props.enableDev ? CONSTANTS.COMPONENT_ICONS_INLINE_STYLE.second : CONSTANTS.COMPONENT_ICONS_INLINE_STYLE.first }
          visibility={ this.state.text ? 'visible' : 'hidden' }
          hoverColor={ CONSTANTS.COLORS.normal }
          onClick={ this.handleDeleteFromIcon.bind(this) }
        />
      </div>
		);
	};

};

export default DropdownFieldDumb;
