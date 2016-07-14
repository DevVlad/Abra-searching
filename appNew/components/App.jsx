import React from 'react';
import { connect } from 'react-redux';

import DropdownField from './dropdownfield.jsx';
import Loading from './loading.jsx';
import testValueDuck from '../redux/ducks/testValueDuck.js';
import Progress from '../redux/ducks/progress.jsx';

@connect(state => (
	{
	testId: testValueDuck.getTestState(state)
	}
))
class App extends React.Component{
	constructor(props){
		super(props);
	}

	changeTestValue(id) {
		this.props.dispatch(testValueDuck.setTestId('testId', id));
	}

	handleStart() {
		this.props.dispatch(Progress.start(20));
		setTimeout( () => {
			this.props.dispatch(Progress.start());
		}, 900);
	}

	handleStop() {
		this.props.dispatch(Progress.stop());
	}

	handleStep() {
		this.props.dispatch(Progress.step(10));
		// setTimeout( () => {
		// 	this.props.dispatch(Progress.step(5));
		// }, 900);
	}

	render(){
		return (
			<div className="mainDiv">
				<button onClick={ this.handleStart.bind(this) }>Start</button>
				<button onClick={ this.handleStep.bind(this) }>Step</button>
				<button onClick={ this.handleStop.bind(this) }>Stop</button>
				<DropdownField
					alias='a'
					entityName="kontakt"
					onChange={ this.changeTestValue.bind(this) }
    			entityId={ this.props.testId}
					entityToText={ object => [object.jmeno, object.prijmeni].join(' ') }
					filterToCondition={ text => ({type: 'comp', operator: 'like', left: 'jmeno', right: text}) }
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
			</div>
		)
	}

};

export default App;
