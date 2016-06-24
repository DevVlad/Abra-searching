import React from 'react';
import { connect } from 'react-redux';

import ContactDropdown from './contactdropdown.jsx';
import Loading from './loading.jsx'

class App extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className="mainDiv">
				<ContactDropdown alias='a' />
				<ContactDropdown alias='b' />
				<Loading />
			</div>
		)
	}

}

export default App;
