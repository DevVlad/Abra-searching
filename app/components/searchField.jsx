import React from 'react';
import ApiService from '../services/apiservice.js';
import RenderList from './renderlist.jsx';
import { createStore } from 'redux';
import reducer from './reducer.jsx';

/*
require('./App.css');
*/

class SearchField extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			hint: []
		};
	}

	//searching, input is array of objects with params
	//input, data, hint
	handleSoftFilter(inputSave, mainData, hint){
		console.log('Applying of soft filter...');
		const expr = new RegExp('\\b' + inputSave.split(' ').map(exp => '(' + exp + ')').join('.*\\b'),'i'); 
		mainData.kontakt.map(x => {
			if ( expr.test(x.jmeno) || expr.test(x.prijmeni) || expr.test(x.email) || expr.test(x.mobil) || expr.test(x.tel)  ) {
				hint.push(x);
			}
		});
		console.log(hint)
		this.setState({hint: hint});
	}

	//Deciding if soft filter can start
	//paging, input, data, hint
	handleDecide(paging, input, mainData, hint){
		console.log('Deciding...');
		let data = mainData;
		if (parseInt(data['@rowCount']) <= 10 && input === this.refs.input.value) {
			this.handleSoftFilter(input, data, hint);		
		} else if (input === this.refs.input.value) {
			this.handleSoftFilter(input, data, hint);
			if ((hint.length < 10 && paging < parseInt(data['@rowCount'])) && input === this.refs.input.value) {
				this.handleRequest(paging + data.kontakt.length, input, data, hint);
			} 
		} 
	}

	//request generator
	//paging, input, data, hint
	handleRequest(paging, x, mainData, hint) {	
		console.log('Request operations in progress for paging: ' + paging + ' ...');
		ApiService.getRequest({
			'add-row-count' : true,
			'start' : paging
		}, `jmeno like similar '${x}' or prijmeni like similar '${x}' or email like similar '${x}' or mobil like similar '${x}' or tel like similar '${x}'`).then( data => {
			mainData = data.winstrom;
			//paging, input, data, hint
			this.handleDecide(paging, x, mainData, hint);
		});	
	}

	//reaguje na zmenu v poli input
	//initialization of input, data, hint
	handleChange() {
		if (this.refs.input.value !== '') {
			let input = this.refs.input.value;
			console.log('Submiting for input: ' + input);			
			let mainData = [];
			let hint = [];
			//paging, input, data, hint
			this.handleRequest(0, input, mainData, hint);	
		} else {
			console.log('Waiting for input...');
			this.setState({hint: []});
		}
	}

	test() {
		const store = createStore(reducer);
		store.dispatch({
			type: "SET_STATE",
			state: {data: [3,0,8],
					hint: [1,2,3,4,5],
					forInput: this.refs.input.value
			}
		});
		console.log(store.getState())
		store.dispatch({type: "SET_FILTER"});

	}
			
	render(){
		//input react onChange 
		return (
			<div className="mainDiv">
				<h1 className="title" onClick={this.test.bind(this)}>Search field</h1>
				<form className="myform" role="form">
					<div className="subDiv">
						<label className="label">Searching for...</label>
	                    <input className="input" ref="input" type="text" placeholder="Search" onChange={this.handleChange.bind(this)} />	
                    </div>
				</form>
				<RenderList data={this.state.hint}></RenderList>
			</div>
		)
	}
}

export default SearchField;