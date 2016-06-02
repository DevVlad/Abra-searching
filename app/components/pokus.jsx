import React from 'react';
import ApiService from '../services/apiservice.js';
import RenderList from './renderlist.jsx';
import reducer from '../reducers/reducer.jsx';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { setFilter, setLoading, setLoaded, addHint, setInit } from '../actions/actions.jsx'

/*
require('./App.css');
*/

class Pokus extends React.Component{
	constructor(props){
		super(props);
		
		this.state = {
			hint: []
		};
	}


	test() {
		let store = createStore(reducer, applyMiddleware(thunk));
		let x = store.subscribe(() => {
			console.log('--------------------------------');
			console.log(store.getState());
		});
		
		store.dispatch(setInit());
		store.dispatch(setFilter(this.refs.input.value));
		// store.dispatch(setLoading());
		// store.dispatch(addHint([2,2]));
		// store.dispatch(addHint([2,2,3,3,4,39]));
		// store.dispatch(addHint([2,2,4,5,7,9]));
		// store.dispatch(setLoaded());

		x();
	}
			
	render(){
		//input react onChange 
		return (
			<div className="mainDiv">
				<h1 className="title" onClick={this.test.bind(this)}>Search field</h1>
				<form className="myform" role="form">
					<div className="subDiv">
						<label className="label">Searching for...</label>
	                    <input className="input" ref="input" type="text" placeholder="Search" />	
                    </div>
				</form>
				<RenderList data={this.state.hint}></RenderList>
			</div>
		)
	}
}

export default Pokus;