import React from 'react';
import RenderList from './renderlist.jsx';
import RenderLoading from './renderloading.jsx';
import RenderWhisperer from './renderwhisperer.jsx';
import WhispererNew from './renderwhisperernew.jsx';
import { connect } from 'react-redux';
import { setFilter } from '../actions/actions.jsx';
import { stateSelectorList } from '../selectors/selectors.jsx';

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
	          	<input className="input" type="text" placeholder="Search" onChange={this.filterChange.bind(this)} />
          </div>
				</form>
				<WhispererNew />
				<RenderLoading />
				<RenderList data={this.props.hint.toJS()} />
				<RenderWhisperer />
			</div>
		)
	}
}

function mapStateToProps(state) {
	return stateSelectorList(state);
}

const appConnect = connect(mapStateToProps)(App);
export default appConnect;
