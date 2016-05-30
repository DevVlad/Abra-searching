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
	handleSoftFilter(){
		console.log('Applying of soft filter...');
		const expr = new RegExp('\\b' + this.refs.input.value.split(' ').map(exp => '(' + exp + ')').join('.*\\b'),'i'); 
		this.shadow.data.kontakt.map(x => {
			if ( expr.test(x.jmeno) || expr.test(x.prijmeni) || expr.test(x.email) || expr.test(x.mobil) || expr.test(x.tel)  ) {
				this.shadow.hint.push(x);
			}
		});
		this.setState({hint: this.shadow.hint});
	}

	//Deciding if soft filter can start
	handleDecide(paging, input){
		console.log('Deciding...');
		let data = this.shadow.data;
		if (parseInt(data['@rowCount']) <= 10 && input === this.refs.input.value) {
			this.handleSoftFilter();		
		} else if (parseInt(data['@rowCount']) > data.kontakt.length && input === this.refs.input.value) { 
			this.handleSoftFilter();
			if ((this.shadow.hint.length < 10 && paging < parseInt(data['@rowCount'])) && input === this.refs.input.value) {
				this.handleRequest(paging + data.kontakt.length, input);
				// this.setState({hint: this.shadow.hint});
			} 
		} 
	}

	//request generator
	handleRequest(paging, x) {	
		console.log('Request operations in progress for paging: ' + paging + ' ...');
		ApiService.getRequest({
			'add-row-count' : true,
			'start' : paging
		}, `jmeno like similar '${x}' or prijmeni like similar '${x}' or email like similar '${x}' or mobil like similar '${x}' or tel like similar '${x}'`).then( data => {
			this.shadow.data = data.winstrom;
			this.handleDecide(paging, x);
		});	
	}

	onSubmit(e){
		console.log('Submiting for input: ' + this.refs.input.value);

		e.preventDefault();
		this.shadow.data = [];
		this.shadow.hint = [];
		this.shadow.inputSave  = '';
		this.handleRequest(0);
	}

	handleChange() {
		if (this.refs.input.value !== '') {
			this.shadow.inputSave = this.refs.input.value;
			console.log('Submiting for input: ' + this.shadow.inputSave);			
			this.shadow.data = [];
			this.shadow.hint = [];
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
				<h1 className="title">First Assignment</h1>
				<form className="myform" role="form">
					<div className="subDiv">
						<label className="label">Searching for...</label>
	                    <input style={{backgroundColor: this.shadow.hint.length === 0 ? "red" : "blue"}} className="input" ref="input" type="text" placeholder="Search" onChange={this.handleChange.bind(this)} />	
                    </div>

				</form>
				<RenderList data={this.state.hint}></RenderList>
			</div>
		)
		//input react on submit button
		// return (
		// 	<div className="mainDiv">
		// 		<h1 className="title">First Assignment</h1>
		// 		<form className="myform" onSubmit={this.onSubmit.bind(this)} role="form">
		// 			<div className="subDiv">
		// 				<label className="label">Searching for...</label>
	 //                    <input className="input" ref="input" type="text" placeholder="Search" />	                   
  //                   </div>
  //                   <button className="buttonSubmit" type="submit">Find!</button>
		// 		</form>
		// 		<RenderList data={this.state.hint}></RenderList>
		// 	</div>
		// )
	}
}

export default App;