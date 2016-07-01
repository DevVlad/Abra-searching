import React from 'react';
import { connect } from 'react-redux';

import DropdownField from './dropdownfield.jsx';
import testValueDuck from '../redux/ducks/testValueDuck.js';

@connect(state => (
	{
	testId: testValueDuck.getTestState(state)
	}
))
class App extends React.Component{
	constructor(props){
		super(props);
	};

	changeTestValue(id) {
		this.props.dispatch(testValueDuck.setTestId('testId', id));
	};

	render(){
		return (
			<div className="mainDiv">
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
			</div>
		)
	};

};

export default App;
