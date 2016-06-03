import React from 'react';
import ApiService from '../services/apiservice.js';
import RenderList from './renderlist.jsx';
import { connect } from 'react-redux';
import thunk from 'redux-thunk';
import { setFilter } from '../actions/actions.jsx'

/*
require('./App.css');
*/

class App extends React.Component{
	constructor(props){
		super(props);
	}

	filterChange(e) {
		this.props.dispatch(setFilter(e.target.value));
	}
			
	render(){
		//input react onChange 
		return (
			<div className="mainDiv">
				<h1 className="title">Contact list search for:  {this.props.filter}</h1>
				<form className="myform" role="form">
					<div className="subDiv">
						<label className="label">Searching for...</label>
	                    <input className="input" ref="input" type="text" placeholder="Search" onChange={this.filterChange.bind(this)}/>
                    </div>
				</form>
				<RenderList data={this.props.hint} loading={this.props.loading}></RenderList>
			</div>
		)
	}
}

export default connect(state => {
	return { 
		filter: state.filter,
		hint: state.hint,
		loading: state.loading
	};
})(App);

/*

 state => state
 state => { return state; }

 state => { return { hint: state.hint }; }
 state => ({ hint: state.hint })

 */