import React from 'react';
import ApiService from '../services/apiservice.js';
import RenderList from './renderlist.jsx';
import reducer from '../reducers/reducer.jsx';
import { createStore, applyMiddleware } from 'redux';
import { connect } from 'react-redux';
import thunk from 'redux-thunk';
import { setFilter, setLoading, setLoaded, addHint, setInit } from '../actions/actions.jsx'

/*
require('./App.css');
*/

class Pokus extends React.Component{
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
				<h1 className="title">Contact list {this.props.filter}</h1>
				<form className="myform" role="form">
					<div className="subDiv">
						<label className="label">Searching for...</label>
	                    <input className="input" ref="input" type="text" placeholder="Search" onChange={this.filterChange.bind(this)}/>
                    </div>
				</form>
				<RenderList data={this.props.hint}></RenderList>
			</div>
		)
	}
}

export default connect(state => {
	return state; // { hint: state.hint };
})(Pokus);

/*

 state => state
 state => { return state; }

 state => { return { hint: state.hint }; }
 state => ({ hint: state.hint })

 */