import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DropdownFieldDumb2 from './DropdownFieldDumb2.jsx';
import SvgIcon from 'material-ui/SvgIcon';
import lodash from 'lodash';
// import RefreshIndicator from 'material-ui/RefreshIndicator';
import AbstractAutoComplete from './AbstractAutoComplete.jsx';
import Immutable from 'immutable';

import DropdownFieldDuck from '../redux/ducks/dropdownfieldDuck.jsx';
import CONSTANTS from './CONSTANTS.jsx';

import './App.css';

const AddIcon = (props) => (
	<SvgIcon {...props} color={ CONSTANTS.COLORS.disabled }>
		<path
			d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
	</SvgIcon>
);

class DropdownField extends React.Component {
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
		onNewRecord: PropTypes.func,
		noData: PropTypes.bool
	};

	constructor(props) {
		super(props);
		this.state = {
			list: []
		};
	}

	shouldComponentUpdate(newProps, nextState) {
		if ((!Immutable.is(newProps.data, this.props.data) && newProps.data.size > 0) ||
			(!newProps.data && this.props.data) ||
			(newProps.value && newProps.value !== this.props.value) ||
			(newProps.entity && this.state.list[0] !== newProps.entity) ||
			(!newProps.value && this.props.value) ||
			(this.props.errorText !== newProps.errorText || this.props.noData !== newProps.noData ) ||
			(this.props.warnText !== newProps.warnText) ||
			(!Immutable.is(Immutable.fromJS(nextState.list), Immutable.fromJS(this.state.list)))
		) {
			return true;
		} else {
			return false;
		}
	}

	componentWillReceiveProps(newProps) {
		if (this.props.data && newProps.data && !Immutable.is(this.props.data, newProps.data)) {
			if (newProps.data.size === 0) this.setState({ list: [] });
		}
	}

	componentWillUpdate(newProps) {
		if (newProps.entity) {
			let list = [];
			list.push(newProps.entity);
			this.setState({ list }); // TODO mase
		} else if (newProps.data !== this.props.data) {
			this.setState({ list: newProps.data.toJS() });
		} else if (newProps.errorText || newProps.noData) {
			this.setState({ list: newProps.data ? newProps.data.toJS() : [] });
		}
	}

	handleUnknownId(e) {
		if (e) {
			this.props.dispatch(DropdownFieldDuck.findEntityById(this.props.entityType, e, this.props.alias));
		}
	}

	handleTyping = lodash.debounce(
		(e) => {
			this.props.dispatch(DropdownFieldDuck.findDataByCondition(
				this.props.entityType,
				e !== '' ? this.props.filterToCondition(e) : null,
				this.props.alias));
		}, 250);

	handleOnSelect(e) {
		this.props.onChange(e.id);
		this.props.dispatch(DropdownFieldDuck.setDelete(this.props.alias, ['data']));
	}

	handleOnBlur(e) {
		this.props.dispatch(DropdownFieldDuck.setDelete(this.props.alias, ['data']));
		if (this.props.onBlur) this.props.onBlur(e);
	}

	menuShouldAppear(e, icon) {
		if (icon) alert('Icon for something bigger!');
	}

	onCloseMenu(e) {
		this.props.dispatch(DropdownFieldDuck.setDelete(this.props.alias, ['data']));
	}

	_isNewAllowed() {
		return this.props.onNewRecord;
	}

	render() {
		let passText = "";
		let errorText = "";
		if (this.props.noData) {
			const msg = `${this.props.alias}: No data found on Server!`;
			if (this._isNewAllowed()) {
				passText = `${msg} Do You want to create the record in database?`
			} else {
				errorText = msg;
			}
		}
		console.log('DropdownField: render', errorText, this.props.noData, passText);

		return (
			<div id={`DropdownFieldCleverNEW_${this.props.alias}`}>
				<DropdownFieldDumb2
					alias={ this.props.alias }
					label={ this.props.label }
					data={ this.state.list }
					errorText={ errorText }
					warnText={ this.props.warnText }
					passText={ passText }
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
					handleUnknown={ this.handleUnknownId.bind(this) }
					menuShouldAppear={ this.menuShouldAppear.bind(this) }
					onCloseMenu={ this.onCloseMenu.bind(this) }
				/>
				<AddIcon
					style={ {
						...CONSTANTS.COMPONENT_ICONS_INLINE_STYLE.second,
						transform: this.props.value ? 'translate(+200px, -62px)' : 'translate(+215px, -60px)'
					} }
					visibility={ this.props.noData && this._isNewAllowed() ? 'visible' : 'hidden' }
					hoverColor={ CONSTANTS.COLORS.pass }
					onClick={ () => this.props.onNewRecord(this.props.filter) }
				/>
			</div>
		);
	};

}
;

function mapStateToProps(state, props) {
	return {
		...props,
		filter: DropdownFieldDuck.getFilter(state, props.alias),
		data: DropdownFieldDuck.getData(state, props.alias),
		// loading: DropdownFieldDuck.getLoading(state, props.alias),
		entity: DropdownFieldDuck.getEntityfromId(state, props.alias),
		noData: DropdownFieldDuck.getNoData(state, props.alias),
	};
};

const appConnect = connect(mapStateToProps)(DropdownField);
export default appConnect;
