import React from 'react';
import { connect } from 'react-redux';

import DropdownField from './dropdownfield.jsx';

class App extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className="mainDiv">
				<DropdownField
					alias='a'
					entityName="kontakt"
    			entityId={107}
					entityToText={{}}
				/>
			</div>
		)
	}

}

export default App;
