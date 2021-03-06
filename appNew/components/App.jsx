import React from 'react';
import { connect } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import DropdownFieldOld from './DropdownFieldOld.jsx';
import Loading from './Loading.jsx';
import testValueDuck from '../redux/ducks/testValueDuck.js';
import Progress from '../redux/ducks/progress.jsx';
import MenuList from './MenuList.jsx';
import CheckboxField from './CheckboxField.jsx';
import TextField from './TextField.jsx';
import TimeField from './TimeField.jsx';
import DateField from './DateField.jsx';
import ButtonField from './ButtonField.jsx';
import FloatingButtonField from './FloatingButtonField.jsx';
import ToggleField from './ToggleField.jsx';
import NumberField from './NumberField.jsx';
import TextareaField from './TextareaField.jsx';

import AbstractBlbej from './DropdownFieldDumb2.jsx';
import DropdownField2 from './DropdownField2.jsx';

import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import SvgIcon from 'material-ui/SvgIcon';
import ContentAdd from 'material-ui/svg-icons/content/add';

injectTapEventPlugin();

import CONSTANTS from './CONSTANTS.jsx';

@connect(state => {
	return {
		testId: testValueDuck.getTestState(state),
		textForSelectField: testValueDuck.getValueFroSelectField(state),
		valueOfCheckbox: testValueDuck.getValueOfCheckbox(state),
		valueOfTextfield: testValueDuck.getValueOfSelectField(state),
		valueOfTimefield: testValueDuck.getValueOfTimeField(state),
		valueOfDatefield: testValueDuck.getValueOfDateField(state)
	};
})
class App extends React.Component{
	constructor(props){
		super(props);
	}

	setValue(where, what) {
		this.props.dispatch(testValueDuck.setValue(where, what));
	}

	setValueForTextfield(text) {
		this.props.dispatch(testValueDuck.setValue('textfield', text));
	}

	setValueForCheckbox(bool) {
		this.props.dispatch(testValueDuck.setValue('checkbox', bool));
	}

	setValueForSelectField(text) {
		this.props.dispatch(testValueDuck.setValue('textForSelectField', text));
	}

	changeTestValue(id) {
		this.props.dispatch(testValueDuck.setTestId('testId', id));
	}

	handleStart() {
		this.props.dispatch(Progress.start());
	}

	handleStop() {
		this.props.dispatch(Progress.stop());
	}

	handleStart10() {
		this.props.dispatch(Progress.start(10));
	}

	handleStop10() {
		this.props.dispatch(Progress.stop(10));
	}

	render(){
		// console.log('app',this.props);
		return (
			<div className="mainDiv">
				<button onClick={ this.handleStart.bind(this) }>Start()</button>
				<button onClick={ this.handleStart10.bind(this) }>Start 10</button>
				<button onClick={ this.handleStop.bind(this) }>Stop()</button>
				<button onClick={ this.handleStop10.bind(this) }>Stop 10</button>
				<DropdownFieldOld
					alias='a'
					label='clever dropdown old a'
					entityName="kontakt"
					onChange={ this.changeTestValue.bind(this) }
					entityId={ this.props.testId }
					entityToText={ object => [object.jmeno, object.prijmeni].join(' ') }
					filterToCondition={ text => ({type: 'comp', operator: 'like', left: 'jmeno', right: text}) }
					loadingNotify={ true }
				/>
				<br/>
				<Loading />
				<MenuList
					alias='SelectField'
					menuItems={ CONSTANTS.FAKEDATA }
					onChange={ this.setValueForSelectField.bind(this) }
					value={ this.props.textForSelectField }
				/>
				<br/>
				<CheckboxField
					alias='checkbox'
					label='checkbox1'
					// checkedIcon={<SvgIcon>
				  //   <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
					// 	</SvgIcon>}
					// uncheckedIcon={<ActionFavoriteBorder />}
					onChange={ this.setValueForCheckbox.bind(this) }
					onBlur={ (x) => console.log('Checkbox onBlur()', x) }
					value={ this.props.valueOfCheckbox }
				/>
				<br/>
				<TextField
					alias='textfield'
					label='TextField'
					disabled={false}
					onBlur={ (x) => {
						if (this.props.valueOfTextfield !== x) this.setValue('textfield', x);
						console.log('Textfield onBlur()', x);
					 } }
					value={ this.props.valueOfTextfield }
				/>
				<br/>
				<TimeField
					alias='timefield'
					timeFormat={24}
					label="TimeField"
					onBlur={ (x) => console.log('timefield onBlur', x) }
					onChange={ (x) => console.log('timefield onChange', x) }
					disabled={false}
					locale='cs'
					errorText=''
					warnText=''
					// value={ this.props.valueOfTimefield }
					enableMousePicker
				/>
				<br/>
				<DateField
					alias='datefield'
					label="DateField"
					onChange={ (x) => console.log('datefield onChange', x) }
					onBlur={ (x) => console.log('datefield onBlur', x) }
					disabled={false}
					// value={ this.props.valueOfDatefield }
					enableMousePicker
					locale='cs'
					errorText=''
					warnText=''
					// displayFormat="YYYY/MM/DD"
				/>
				<br/>
				<ButtonField
					alias='buttonfield'
					onClick={ (x) => console.log('ButtonField clicked! ',x) }
					disabled={ false }
					label='button'
					buttonValue=''
					onBlur={ (x) => console.log('ButtonField onBlur! ', x) }
					onMouseEnter={ (x) => console.log('ButtonField onMouseEnter! ', x) }
					backgroundColor='info'
					icon={
						<SvgIcon><circle cx="12" cy="4" r="2"/>
							<path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07z"/>
						</SvgIcon>
					}

				/>
				<br/>
				<FloatingButtonField
					alias='FloatingActionButton'
					onClick={ (x) => console.log('FloatingActionButton clicked! ',x) }
					onMouseEnter={ (x) => console.log("FloatingActionButton onMouseEnter! ", x) }
					disabled={ false }
					label='button'
					onBlur={ (x) => console.log('FloatingActionButton onBlur! ', x) }
					backgroundColor='info'
					icon={ <ContentAdd /> }
				/>
				<br/>
				<ToggleField
					alias='togglefield'
					label='toggle button'
					labelPosition='right'
					value={ true }
					disabled={ false }
					onChange={ (x) => console.log('ToggleField onChange', x) }
					onBlur={ (x) => console.log('ToggleField onBlur', x) }
				/>
				<br/>
				<div id='druhacast'>
					{/*<DropdownField
						alias='cleverDropdown'
						label='clever dropdown new'
						entityType="kontakt"
						onChange={ this.changeTestValue.bind(this) }
						onBlur={ (e) => console.log('DropdownNewClever on Blur', e) }
						value={ parseInt(this.props.testId) }
						entityToText={ object => [object.jmeno, object.prijmeni].join(' ').trim() }
						filterToCondition={ text => ({type: 'comp', operator: 'like', left: 'jmeno', right: text}) }
						loadingNotify={ true }
					/>*/}
				<br/>
					<NumberField
						alias='numberField'
						label='enter a number'
						errorText=''
						warnText=''
						value={ 27 }
					/>
				<br/>
					<TextareaField
						alias='textarea'
						label='textfieldarea'
						errorText=''
						warnText=''
						value='aloha'
						onBlur={ (x) => {console.log('TextareaField onBlur ', x)} }
					/>
				<br/>
					<AbstractBlbej
							alias='dropdownDumb'
							label='Den v týdnu'
							data={[
								{id: 0, text: 'pondělí'},
								{id: 1, text: 'útery'},
								{id: 2, text: 'středa'},
								{id: 3, text: 'čtvrtek'},
								{id: 4, text: 'pátek'},
								{id: 5, text: 'sobota'},
								{id: 6, text: 'neděle'}
							]}
							entityToText={ obj => obj.text }
							entityToValue={ object => object.id }
							value={ 1 }
							// data={ CONSTANTS.FAKEDATA }
							// value='Is'
							onChange={ (e) => console.log('AbstractBlbej onChange', e) }
							onBlur={ (e) => console.log('AbstractBlbej on Blur', e) }
						/>
					<br/>
						<DropdownField2
							alias='cleverDropdown2'
							label='Zákazník'
							entityType="kontakt"
							onChange={ this.changeTestValue.bind(this) }
							onBlur={ (e) => console.log('DropdownNewClever on Blur', e) }
							value={ parseInt(this.props.testId) }
							entityToText={ object => [object.jmeno, object.prijmeni].join(' ').trim() }
							filterToCondition={ text => ({type: 'comp', operator: 'like', left: 'jmeno', right: text}) }
							loadingNotify={ true }
							allowNew={ true }
						/>
				</div>
			</div>
		)
	}

};

export default App;
