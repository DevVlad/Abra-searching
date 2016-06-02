import React from 'react';
import ApiService from '../services/apiservice.js';
import RenderList from './renderlist.jsx';
import reducer from './reducer.jsx';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

/*
require('./App.css');
*/

class SearchField extends React.Component{
	constructor(props){
		super(props);
		this.data = [];
		this.state = {
			hint: []
		};
	}

	//searching, input is array of objects with params
	//input, data, hint
	handleSoftFilter(paging, input, mainData){
		if (mainData.kontakt.length !== 0) {
			let hint = [];
			console.log('Applying of soft filter...');
			const expr = new RegExp('\\b' + input.split(' ').map(exp => '(' + exp + ')').join('.*\\b'),'i'); 
			mainData.kontakt.map(x => {
				if ( expr.test(x.jmeno) || expr.test(x.prijmeni) || expr.test(x.email) || expr.test(x.mobil) || expr.test(x.tel) ) {
					hint.push(x);
				}
			});
			let output = {paging: paging, input: input, hint: hint, totalCount: parseInt(mainData['@rowCount'])};			
			return output;
		}
	}

	//Deciding if soft filter can start
	//paging, input, data, hint
	handleDecide(obj, input){
		console.log('Deciding...');
		if ((obj.totalCount < 10 && obj.input === input) || (obj.hint.length >= 10 && obj. input === input)) {
			return {...obj, status: "OK"};
		} else if ((obj.hint.length < 10 && obj.paging < obj.totalCount) && obj.input === input) {
			return {...obj, status: "again"};
		} else {
			return console.log('Error in decider!');
		}
	}

	//request generator
	//paging, x, mainData, hint
	handleRequest(paging, x) {	
		console.log('Request operations in progress for paging: ' + paging + ' ... and for input:' + x);	
		return ApiService.getRequest({
			'add-row-count' : true,
			'start' : paging
			}, `jmeno like similar '${x}' or prijmeni like similar '${x}' or email like similar '${x}' or mobil like similar '${x}' or tel like similar '${x}'`).then( data => {
			let pom = this.handleSoftFilter(paging, x, data.winstrom); 		
			return pom;
			// this.handleDecide(this.handleSoftFilter(paging, x, data.winstrom));
		});
		// console.log(this.data)
		// return 'pokus'
	}

	//reaguje na zmenu v poli input
	//initialization of input, data, hint
	// handleChange() {
	// 	if (this.refs.input.value !== '') {
	// 		let input = this.refs.input.value;
	// 		console.log('Submiting for input: ' + input);			
	// 		let mainData = [];
	// 		let hint = [];
	// 		this.handleRequest(0, input, mainData, hint);	
	// 	} else {
	// 		console.log('Waiting for input...');
	// 		this.setState({hint: []});
	// 	}
	// }

	test() {
		const store = createStore(reducer, applyMiddleware(thunk));
		store.dispatch({
			type: "SET_INITIAL_STATE",
			forInput: this.refs.input.value
		});

		let middleIssue = (paging) => {
			store.dispatch({type: "SET_LOADING"});
			let x = this.handleRequest(paging, store.getState().forInput).then((data) => {
				let dec = this.handleDecide(data, store.getState().forInput);
				if (dec.status === 'OK') {
					return ({
						type: 'SET_LOADED',
						hint: dec.hint
					});
				} else if (dec.status === 'again' && dec. hint.length > 0) {
					return ({
						paging: paging
					})
				}
			});

			// setTimeout(function(){ console.log(x)}, 2000);
			// return (dispatch) => {
			// 	return dispatch({type: "SET_FILTER"}) ;
			// };			
		};
		let x = middleIssue(0);
		// setTimeout(function(){ console.log(x)}, 2000);
		// store.dispatch(middleIssue(0));		
		// store.getState().type === 'SET_FILTER' ? console.log('true', store.getState()) : console.log('false - something wrong', store.getState());
		
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

export default SearchField;