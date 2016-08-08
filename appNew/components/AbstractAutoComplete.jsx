import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import keycode from 'keycode';
import TextField from 'material-ui/TextField';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Popover from 'material-ui/Popover/Popover';
import propTypes from 'material-ui/utils/propTypes';
import warning from 'warning';
import deprecated from 'material-ui/utils/deprecatedPropType';

// Added in case of menu icon - must be here, otherwise couses problems with state and has inappropriate behaviour
import CONSTANTS from './CONSTANTS.jsx';
import SvgIcon from 'material-ui/SvgIcon';

const MenuIcon = (props) => (
  <SvgIcon {...props} color={ CONSTANTS.COLORS.disabled }>
    <path d="M7 10l5 5 5-5z" />
  </SvgIcon>
);

function getStyles(props, context, state) {
  const {anchorEl} = state;
  const {fullWidth} = props;

  const styles = {
    root: {
      display: 'inline-block',
      position: 'relative',
      width: fullWidth ? '100%' : 256,
    },
    menu: {
      width: '100%',
      position: 'relative'
    },
    list: {
      display: 'block',
      width: fullWidth ? '100%' : 256,
    },
    innerDiv: {
      overflow: 'hidden',
    },
  };

  if (anchorEl && fullWidth) {
    styles.popover = {
      width: anchorEl.clientWidth,
    };
  }

  return styles;
}



class AbstractAutoComplete extends Component {
  static propTypes = {
    /**
     * Location of the anchor for the auto complete.
     */
    anchorOrigin: propTypes.origin,
    /**
     * If true, the auto complete is animated as it is toggled.
     */
    animated: PropTypes.bool,
    /**
     * Override the default animation component used.
     */
    animation: PropTypes.func,
    /**
     * Array of strings or nodes used to populate the list.
     */
    dataSource: PropTypes.array.isRequired,
    /**
     * Config for objects list dataSource.
     *
     * @typedef {Object} dataSourceConfig
     *
     * @property {string} text `dataSource` element key used to find a string to be matched for search
     * and shown as a `TextField` input value after choosing the result.
     * @property {string} value `dataSource` element key used to find a string to be shown in search results.
     */
    dataSourceConfig: PropTypes.object,
    /**
     * Disables focus ripple when true.
     */
    disableFocusRipple: PropTypes.bool,
    /**
     * Override style prop for error.
     */
    errorStyle: PropTypes.object,
    /**
     * The error content to display.
     */
    errorText: PropTypes.node,
    /**
     * Callback function used to filter the auto complete.
     *
     * @param {string} searchText The text to search for within `dataSource`.
     * @param {string} key `dataSource` element, or `text` property on that element if it's not a string.
     * @returns {boolean} `true` indicates the auto complete list will include `key` when the input is `searchText`.
     */
    filter: PropTypes.func,
    /**
     * The content to use for adding floating label element.
     */
    floatingLabelText: PropTypes.node,
    /**
     * If true, the field receives the property `width: 100%`.
     */
    fullWidth: PropTypes.bool,
    /**
     * The hint content to display.
     */
    hintText: PropTypes.node,
    /**
     * Override style for list.
     */
    listStyle: PropTypes.object,
    /**
     * The max number of search results to be shown.
     * By default it shows all the items which matches filter.
     */
    maxSearchResults: PropTypes.number,
    /**
     * Delay for closing time of the menu.
     */
    menuCloseDelay: PropTypes.number,
    /**
     * Props to be passed to menu.
     */
    menuProps: PropTypes.object,
    /**
     * Override style for menu.
     */
    menuStyle: PropTypes.object,
    /** @ignore */
    onBlur: PropTypes.func,
    /** @ignore */
    onFocus: PropTypes.func,
    /** @ignore */
    onKeyDown: PropTypes.func,
    /**
     * Callback function that is fired when a list item is selected, or enter is pressed in the `TextField`.
     *
     * @param {string} chosenRequest Either the `TextField` input value, if enter is pressed in the `TextField`,
     * or the text value of the corresponding list item that was selected.
     * @param {number} index The index in `dataSource` of the list item selected, or `-1` if enter is pressed in the
     * `TextField`.
     */
    onNewRequest: PropTypes.func,
    /**
     * Callback function that is fired when the user updates the `TextField`.
     *
     * @param {string} searchText The auto-complete's `searchText` value.
     * @param {array} dataSource The auto-complete's `dataSource` array.
     */
    onUpdateInput: PropTypes.func,
    /**
     * Auto complete menu is open if true.
     */
    open: PropTypes.bool,
    /**
     * If true, the list item is showed when a focus event triggers.
     */
    openOnFocus: PropTypes.bool,
    /**
     * Text being input to auto complete.
     */
    searchText: PropTypes.string,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * Origin for location of target.
     */
    targetOrigin: propTypes.origin,
    /**
     * Override the inline-styles of AbstractAutoComplete's TextField element.
     */
    textFieldStyle: PropTypes.object,
    /**
     * If true, will update when focus event triggers.
     */
    triggerUpdateOnFocus: deprecated(PropTypes.bool, 'Instead, use openOnFocus. It will be removed with v0.16.0.'),
  };

  static defaultProps = {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    animated: true,
    dataSourceConfig: {
      text: 'text',
      value: 'value',
    },
    disableFocusRipple: true,
    filter: (searchText, key) => searchText !== '' && key.indexOf(searchText) !== -1,
    fullWidth: false,
    open: false,
    openOnFocus: false,
    onUpdateInput: () => {},
    onNewRequest: () => {},
    searchText: '',
    menuCloseDelay: 300,
    targetOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    anchorEl: null,
    focusTextField: true,
    open: false,
    searchText: undefined,
  };

  componentWillMount() {
    this.saveInput;
    this.requestsList = [];
    this.setState({
      open: this.props.open,
      searchText: this.props.searchText,
    });
    this.timerTouchTapCloseId = null;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.searchText !== nextProps.searchText) {
      this.setState({
        searchText: nextProps.searchText,
      });
    }
    // if (nextProps.open && this.state.open !== nextProps.open && nextProps.dataSource.length > 1) {
    //   this.setState({
    //     open: nextProps.open,
    //     anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
    //   });
    //   setTimeout(() => { this.focus() }, 0);
    // }
  }

  componentWillUnmount() {
    clearTimeout(this.timerTouchTapCloseId);
  }

  close() {
    this.setState({
      open: false,
      anchorEl: null,
    });
  }

  open() {
    this.setState({
        open: true,
        anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
    });
  };

  handleRequestClose = () => {
    // Only take into account the Popover clickAway when we are
    // not focusing the TextField.
    if (!this.state.focusTextField) {
      this.close();
    }
  };

  setValue(textValue) {
    warning(false, `setValue() is deprecated, use the searchText property.
      It will be removed with v0.16.0.`);

    this.setState({
      searchText: textValue,
    });
  }

  getValue() {
    warning(false, 'getValue() is deprecated. It will be removed with v0.16.0.');

    return this.state.searchText;
  }

  handleMouseDown = (event) => {
    // Keep the TextField focused
    event.preventDefault();
  };

  handleItemTouchTap = (event, child) => {
    const dataSource = this.props.dataSource;
    const index = parseInt(child.key, 10);
    const chosenRequest = dataSource[index];
    const searchText = this.chosenRequestText(chosenRequest);
    // this.saveInput = searchText;

    this.timerTouchTapCloseId = setTimeout(() => {
      this.timerTouchTapCloseId = null;

      this.setState({
        saveInput: searchText,
        searchText: searchText,
      });
      this.close();
      this.props.onNewRequest(chosenRequest, index);
    }, this.props.menuCloseDelay);
    setTimeout(() => { this.focus() }, 0);
  };

  chosenRequestText = (chosenRequest) => {
    if (typeof chosenRequest === 'string') {
      return chosenRequest;
    } else {
      return chosenRequest[this.props.dataSourceConfig.text];
    }
  };

  handleEscKeyDown = () => {
    this.close();
    setTimeout(() => { this.focus() }, 0);
  };

  handleKeyDown = (event) => {
    if (this.props.onKeyDown) this.props.onKeyDown(event);

    switch (keycode(event)) {
      case 'enter':
        this.close();
        const searchText = this.state.searchText;
        if (searchText !== '') {
          this.props.onNewRequest(searchText, -1);
        }
        break;

      case 'esc':
        this.handleEscKeyDown();
        // this.close();
        break;

      case 'down':
        event.preventDefault();
        this.setState({
          open: true,
          focusTextField: false,
          anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
        });
        break;

      default:
        break;
    }
  };

  // Added becouse of icon to show menu and to be able to react on click ability
  handleOnClick = (e) => {
    if (this.props.menuShouldAppear) this.props.menuShouldAppear(this.state.open ? false : true);
    if (e !== 'icon') {
      this.setState({
        open: this.state.open ? false : true,
        anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
        saveInput: !this.state.open ? this.state.searchText : undefined,
        searchText: this.state.open ? this.state.saveInput : '',
      });
    } else {
      this.setState({
        open: this.state.open ? false : true,
        anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
        saveInput: this.state.saveInput !== this.state.value ? this.state.saveInput : undefined,
      });
    }
    this.state.open ? setTimeout(() => { this.blur() }, 0) : setTimeout(() => { this.focus() }, 0);
  };

  handleChange = (event) => {
    const searchText = event.target.value;

    // Make sure that we have a new searchText.
    // Fix an issue with a Cordova Webview
    if (searchText === this.state.searchText) {
      return;
    }

    this.setState({
      searchText: searchText,
      open: true,
      anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
    }, () => {
      this.props.onUpdateInput(searchText, this.props.dataSource);
    });
  };

  handleBlur = (event) => {
    if (this.state.focusTextField && this.timerTouchTapCloseId === null) {
      // Added becouse of inappropriate blur behaviour
      if (this.state.searchText !== this.state.saveInput || !this.state.saveInput) {
        this.setState({
          searchText: this.props.searchText,
          open: false,
        });
      } else {
        this.close();
      }
    }

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  handleFocus = (event) => {
    if (!this.state.open && (this.props.triggerUpdateOnFocus || this.props.openOnFocus)) {
      this.setState({
        open: true,
        anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
      });
    }

    this.setState({
      focusTextField: true,
    });

    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  blur() {
    this.refs.searchTextField.blur();
  }

  focus() {
    this.refs.searchTextField.focus();
  }

  render() {
    const {
      anchorOrigin,
      animated,
      animation,
      dataSource,
      dataSourceConfig, // eslint-disable-line no-unused-vars
      disableFocusRipple,
      errorStyle,
      floatingLabelText,
      filter,
      fullWidth,
      style,
      hintText,
      maxSearchResults,
      menuCloseDelay, // eslint-disable-line no-unused-vars
      textFieldStyle,
      menuStyle,
      menuProps,
      listStyle,
      targetOrigin,
      triggerUpdateOnFocus, // eslint-disable-line no-unused-vars
      onNewRequest, // eslint-disable-line no-unused-vars
      onUpdateInput, // eslint-disable-line no-unused-vars
      openOnFocus, // eslint-disable-line no-unused-vars
      searchText: searchTextProp, // eslint-disable-line no-unused-vars
      ...other,
    } = this.props;

    const {
      open,
      anchorEl,
      searchText,
      focusTextField,
    } = this.state;

    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context, this.state);

    const requestsList = [];
    dataSource.every((item, index) => {
      switch (typeof item) {
        case 'string':
          if (filter(searchText, item, item)) {
            requestsList.push({
              text: item,
              value: (
                <MenuItem
                  innerDivStyle={styles.innerDiv}
                  value={item}
                  primaryText={item}
                  disableFocusRipple={disableFocusRipple}
                  key={index}
                />),
            });
          }
          break;

        case 'object':
          if (item && typeof item[this.props.dataSourceConfig.text] === 'string') {
            const itemText = item[this.props.dataSourceConfig.text];
            if (!this.props.filter(searchText, itemText, item)) break;

            const itemValue = item[this.props.dataSourceConfig.value];
            if (itemValue.type && (itemValue.type.muiName === MenuItem.muiName ||
               itemValue.type.muiName === Divider.muiName)) {
              requestsList.push({
                text: itemText,
                value: React.cloneElement(itemValue, {
                  key: index,
                  disableFocusRipple: disableFocusRipple,
                }),
              });
            } else {
              requestsList.push({
                text: itemText,
                value: (
                  <MenuItem
                    innerDivStyle={styles.innerDiv}
                    primaryText={itemText}
                    disableFocusRipple={disableFocusRipple}
                    key={index}
                  />),
              });
            }
          }
          break;

        default:
          // Do nothing
      }

      return !(maxSearchResults && maxSearchResults > 0 && requestsList.length === maxSearchResults);
    });

    this.requestsList = requestsList;
    const menu = open && requestsList.length > 0 && (
      <Menu
        {...menuProps}
        ref="menu"
        autoWidth={false}
        disableAutoFocus={focusTextField}
        onEscKeyDown={this.handleEscKeyDown}
        initiallyKeyboardFocused={true}
        onItemTouchTap={this.handleItemTouchTap}
        onMouseDown={this.handleMouseDown}
        style={Object.assign(styles.menu, menuStyle)}
        listStyle={Object.assign(styles.list, listStyle)}
      >
        {requestsList.map((i) => i.value)}
      </Menu>
    );

    return (
      <div style={prepareStyles(Object.assign(styles.root, style))} >
        <TextField
          {...other}
          ref="searchTextField"
          autoComplete="off"
          value={searchText}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyDown={this.handleKeyDown}
          floatingLabelText={floatingLabelText}
          hintText={hintText}
          fullWidth={fullWidth}
          multiLine={false}
          errorStyle={errorStyle}
          style={textFieldStyle}
          onClick={this.handleOnClick}
        />
        <MenuIcon
            style={ {width: '20px', height: '20px', transform: 'translate(+236px, -35px)'} }
            hoverColor={ CONSTANTS.COLORS.normal }
            onClick={ () => {this.handleOnClick('icon')} }
        />
        <Popover
          style={styles.popover}
          canAutoPosition={false}
          anchorOrigin={anchorOrigin}
          targetOrigin={targetOrigin}
          open={open}
          anchorEl={anchorEl}
          useLayerForClickAway={false}
          onRequestClose={this.handleRequestClose}
          animated={animated}
          animation={animation}
        >
          {menu}
        </Popover>
      </div>
    );
  }
}

AbstractAutoComplete.levenshteinDistance = (searchText, key) => {
  const current = [];
  let prev;
  let value;

  for (let i = 0; i <= key.length; i++) {
    for (let j = 0; j <= searchText.length; j++) {
      if (i && j) {
        if (searchText.charAt(j - 1) === key.charAt(i - 1)) value = prev;
        else value = Math.min(current[j], current[j - 1], prev) + 1;
      } else {
        value = i + j;
      }
      prev = current[j];
      current[j] = value;
    }
  }
  return current.pop();
};

AbstractAutoComplete.noFilter = () => true;

AbstractAutoComplete.defaultFilter = AbstractAutoComplete.caseSensitiveFilter = (searchText, key) => {
  return searchText !== '' && key.indexOf(searchText) !== -1;
};

AbstractAutoComplete.caseInsensitiveFilter = (searchText, key) => {
  return key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
};

AbstractAutoComplete.levenshteinDistanceFilter = (distanceLessThan) => {
  if (distanceLessThan === undefined) {
    return AbstractAutoComplete.levenshteinDistance;
  } else if (typeof distanceLessThan !== 'number') {
    throw 'Error: AbstractAutoComplete.levenshteinDistanceFilter is a filter generator, not a filter!';
  }

  return (s, k) => AbstractAutoComplete.levenshteinDistance(s, k) < distanceLessThan;
};

AbstractAutoComplete.fuzzyFilter = (searchText, key) => {
  const compareString = key.toLowerCase();
  searchText = searchText.toLowerCase();

  let searchTextIndex = 0;
  for (let index = 0; index < key.length; index++) {
    if (compareString[index] === searchText[searchTextIndex]) {
      searchTextIndex += 1;
    }
  }

  return searchTextIndex === searchText.length;
};

AbstractAutoComplete.Item = MenuItem;
AbstractAutoComplete.Divider = Divider;

export default AbstractAutoComplete;
