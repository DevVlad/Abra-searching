import React from 'react';
import { connect } from 'react-redux';

import ContactDropdown from './contactdropdown.jsx';
import Loading from './loading.jsx';
import Whisperer from './renderwhisperer.jsx';

class App extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className="mainDiv">
				<ContactDropdown
					alias='a'
					entityName="kontakt"
    			entityId={107}
				/>
				<ContactDropdown
					alias='aa'
					entityName="kontakt"
				/>
				<Loading />
			</div>
		)
	}

}

export default App;
