import React from 'react';
import { connect } from 'react-redux';

import DropdownField from './dropdownfield.jsx';
import Loading from './loading.jsx';
import testValueDuck from '../redux/ducks/testValueDuck.js';
import Progress from '../redux/ducks/progress.jsx';
import MenuList from './menulist.jsx';
import Checkbox from './checkbox.jsx';

@connect(state => {
	return {
		testId: testValueDuck.getTestState(state),
		textForSelectField: testValueDuck.getValueFroSelectField(state),
		valueOfCheckbox: testValueDuck.getValueOfCheckbox(state)
	};
})

class App extends React.Component{
	constructor(props){
		super(props);
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
		const items = [ {text: "Justin"}, {text: "Bieber"}, {text: "Is"}, {text: "The"}, {text: "WORST"}, {text: "Singer"}, {text: "Ever"} ];

		return (
			<div className="mainDiv">
				<button onClick={ this.handleStart.bind(this) }>Start()</button>
				<button onClick={ this.handleStart10.bind(this) }>Start 10</button>
				<button onClick={ this.handleStop.bind(this) }>Stop()</button>
				<button onClick={ this.handleStop10.bind(this) }>Stop 10</button>
				<DropdownField
					alias='a'
					entityName="kontakt"
					onChange={ this.changeTestValue.bind(this) }
    			entityId={ this.props.testId }
					entityToText={ object => [object.jmeno, object.prijmeni].join(' ') }
					filterToCondition={ text => ({type: 'comp', operator: 'like', left: 'jmeno', right: text}) }
					loadingNotify={ true }
				/>
				<DropdownField
					alias='b'
					entityName="kontakt"
					onChange={ this.changeTestValue.bind(this) }
					entityId={ this.props.testId }
					entityToText={ object => [object.jmeno, object.prijmeni].join(' ') }
					filterToCondition={ text => ({type: 'comp', operator: 'like', left: 'jmeno', right: text}) }
				/>
				<Loading />
				<MenuList
					alias={'SelectField'}
					menuItems={ items }
					onChange={ this.setValueForSelectField.bind(this) }
					value={ this.props.textForSelectField }
          errorText='OMG what did u choose !?'
					errorCondition={ this.props.textForSelectField === 'Bieber' }
				/>
			<Checkbox
				alias='checkbox'
				label='checkbox1'
				onChange={ this.setValueForCheckbox.bind(this) }
				onBlur={ (x) => console.log('Checkbox onBlur()',x) }
				value={ this.props.valueOfCheckbox }
			/>

			</div>
		)
	}

};

export default App;
