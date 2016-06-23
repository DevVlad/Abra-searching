import React from 'react';

class App extends React.Component{
	constructor(props){
		super(props);
	}

	filterChange(e) {
		this.props.dispatch(setFilter(e.target.value));
	}

	render(){
		return (
			<div className="mainDiv">
				<h1> Hello! </h1>
			</div>
		)
	}
}
export default App;
