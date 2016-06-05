import React from 'react';
import RenderList from './renderlist.jsx';
import { connect } from 'react-redux';
import { setFilter } from '../actions/actions.jsx';
import Immutable from 'immutable';

/*
require('./App.css');
*/

class App extends React.Component{
	constructor(props){
		super(props);
	}

	filterChange(e) {
		this.props.dispatch(setFilter(e.target.value));
		
		// let obj = {
		// 	filter: e.target.value,
		// 	hint: [{jmeno: 'ales', prijmeni: 'Novak'}, {jmeno: 'eva', prijmeni: 'hola'}],
		// 	loading: true
		// };
		
		// const map = Immutable.fromJS(obj);
		// let map2 = map;
		// console.log('pred: ', map2.toJS());
		// const pom = false;
		// const pom2 = [{jmeno: 'alena', prijmeni: 'Jezni'}, {jmeno: 'eva', prijmeni: 'hrozna'}];
		// const o = Immutable.fromJS(pom2);
		// map2 = map2.updateIn(['loading'], x => pom);
		// map2 = map2.updateIn(['hint'], list => list.concat(Immutable.fromJS(pom2)));
		// console.log('po: ', map2.toJS(), map2);

		// let map = Immutable.fromJS(obj);
		// let map2 = map.updateIn(['a', 'b', 'c'], x => x+1);
		// console.log(map2.toJS())
		// console.log(map2.getIn(['a', 'val']))
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

// export default connect(mapStateToProps)(App);
export default connect(state => {
	let newState = state.toJS(); 
	return { 
		filter: newState.filter,
		hint: newState.hint,
		loading: newState.loading
	};
})(App);

/*

 state => state
 state => { return state; }

 state => { return { hint: state.hint }; }
 state => ({ hint: state.hint })

 */