import React from 'react';
import { connect } from 'react-redux';

import DropdownField from './dropdownfield.jsx';
import testValueDuck from '../redux/ducks/testValueDuck.js';

@connect(state => (
	{
	testId: testValueDuck.getTestValue(state, 'testId')
	}
))
class App extends React.Component{
	constructor(props){
		super(props);
	};

	changeTestValue(id) {
		this.props.dispatch(testValueDuck.setTestValue('testId', id));
	};

	render(){
		return (
			<div className="mainDiv">
				<DropdownField
					alias='a'
					entityName="kontakt"
					onChange={this.changeTestValue.bind(this)}
    			entityId={this.props.testId}
					entityToText={object => [object.jmeno, object.prijmeni].join(' ')}
				/>
			</div>
		)
	};

};

export default App;
