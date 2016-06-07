import React from 'react';
import RenderList from './renderlist.jsx';
import { connect } from 'react-redux';
import { setFilter } from '../actions/actions.jsx';
// import { getFilter, getHint, getLoading } from '../reducers/reducer.jsx';
import { getFilter, getHint, getLoading } from '../selectors/selectors.jsx';

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
				<h1 className="title">Contact list search for:  {this.props.filter}</h1>
				<form className="myform" role="form">
					<div className="subDiv">
						<label className="label">Searching for...</label>
	                    <input className="input" ref="input" type="text" placeholder="Search" onChange={this.filterChange.bind(this)}/>
                    </div>
				</form>
				<RenderList data={this.props.hint.toJS()} loading={this.props.loading}></RenderList>
			</div>
		)
	}
}

function mapStateToProps(state) {
	console.log('a ','F: ', state.toJS().filter.filter, 'S: ', state.toJS().filter.hint, 'L: ', state.toJS().loading.loading);
	console.log('b ','F: ', getFilter(state), 'S: ', getHint(state).toJS(), 'L: ',getLoading(state));
	return {
		filter: getFilter(state),
		hint: getHint(state),
		loading: getLoading(state)
	};
}
const appSelector = connect(mapStateToProps)(App)
export default appSelector;
// export default connect(state => {
// 	return {
// 		filter: getFilter(state),
// 		hint: getHint(state),
// 		loading: getLoading(state)
// 	};
// })(App);