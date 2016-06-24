import React from 'react';
import ContactDropdown from './contactdropdown.jsx';
import { connect } from 'react-redux';

class App extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className="mainDiv">
				<ContactDropdown alias='a' />
				<ContactDropdown alias='b' />
			</div>
		)
	}

}

export default App;
