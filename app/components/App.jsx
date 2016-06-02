import React from 'react';
import ApiService from '../services/apiservice.js';
import RenderList from './renderlist.jsx';

/*
require('./App.css');
*/

class App extends React.Component{
	constructor(props){
		super(props);
		this.shadow = {
			data: [], 
			hint: [],
			inputSave: ''
		};
		this.state = {
			hint: []
		};
	}

	//searching, input is array of objects with params
	//input, data, hint
	handleSoftFilter(){
		console.log('Applying of soft filter...');
		const expr = new RegExp('\\b' + this.shadow.inputSave.split(' ').map(exp => '(' + exp + ')').join('.*\\b'),'i'); 
		this.shadow.data.kontakt.map(x => {
			if ( expr.test(x.jmeno) || expr.test(x.prijmeni) || expr.test(x.email) || expr.test(x.mobil) || expr.test(x.tel)  ) {
				this.shadow.hint.push(x);
			}
		});
		this.setState({hint: this.shadow.hint});
	}

	//Deciding if soft filter can start
	//paging, input, data, hint
	handleDecide(paging, input){
		console.log('Deciding...');
		let data = this.shadow.data;
		if (parseInt(data['@rowCount']) <= 10 && input === this.refs.input.value) {
			this.handleSoftFilter();		
		} else if (input === this.refs.input.value) {
			this.handleSoftFilter();
			if ((this.shadow.hint.length < 10 && paging < parseInt(data['@rowCount'])) && input === this.refs.input.value) {
				this.handleRequest(paging + data.kontakt.length, input);
			} 
		} 
	}

	//request generator
	//paging, input, data, hint
	handleRequest(paging, x) {	
		console.log('Request operations in progress for paging: ' + paging + ' ...');
		ApiService.getRequest({
			'add-row-count' : true,
			'start' : paging
		}, `jmeno like similar '${x}' or prijmeni like similar '${x}' or email like similar '${x}' or mobil like similar '${x}' or tel like similar '${x}'`).then( data => {
			this.shadow.data = data.winstrom;
			//paging, input, data, hint
			this.handleDecide(paging, x);
		});	
	}

	//reaguje na zmenu v poli input
	//initialization of input, data, hint
	handleChange() {
		if (this.refs.input.value !== '') {
			this.shadow.inputSave = this.refs.input.value;
			console.log('Submiting for input: ' + this.shadow.inputSave);			
			this.shadow.data = [];
			this.shadow.hint = [];
			//paging, input, data, hint
			this.handleRequest(0, this.shadow.inputSave);	
		} else {
			console.log('Waiting for input...');
			this.setState({hint: []});
		}
	}
		
	render(){
		//input react onChange 
		return (
			<div className="mainDiv">
				<h1 className="title" >Search field</h1>
				<form className="myform" role="form">
					<div className="subDiv">
						<label className="label">Searching for...</label>
	                    <input style={{backgroundColor: this.shadow.hint.length === 0 ? "red" : "blue"}} className="input" ref="input" type="text" placeholder="Search" onChange={this.handleChange.bind(this)} />	
                    </div>
				</form>
				<RenderList data={this.state.hint}></RenderList>
			</div>
		)
	}
}

export default App;