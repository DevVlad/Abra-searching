import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import select from 'selection-range';
import RenderList from './renderlist.jsx';
import RenderLoading from './renderloading.jsx';
import RenderWhisperer from './renderwhisperer.jsx';
import { setFilter } from '../actions/actions.jsx';
import { stateSelectorList } from '../selectors/selectors.jsx';
import './App.css'

class Whisperer extends React.Component{
	constructor(props){
		super(props);
    this.inputRef ='';
	}

  getWhisperLine(whisper, filter) {
    if (whisper[0] !== '' && [...whisper[0]][0].toLowerCase() === [...filter][0]) {
      let name = whisper[0];
      let lastName = whisper[1];
      name = [...name].slice([...filter].length, name.length).join('');
      return [name, lastName];
    } else if (whisper[1] !== '' && [...whisper[1]][0].toLowerCase() === [...filter][0]) {
      let lastName = whisper[1];
      lastName = [...lastName].slice([...filter].length, lastName.length).join('');
      if (whisper[0] === '') {
        return [lastName];
      }else {
        return [lastName, whisper[0]];
      }
    }
  }

	filterChange(e) {
		this.props.dispatch(setFilter(e.target.value));
	}

	render(){
    let whisper = '';
    let rest = '';
    if (this.props.hint.toJS().length > 0){
      let pom = (this.props.hint.toJS()[0])
      rest = this.getWhisperLine([pom.jmeno, pom.prijmeni], this.props.filter).join(' ');
      whisper = this.props.filter + rest;
      this.inputRef.setSelectionRange(this.props.filter.length, this.inputRef.value.length);
    }

		return (
      <div id="whisper">
  			<form role="formWhisperer">
  				<div>
  					<label className="labelWhisperer">Whisper for...</label>
  	          <input id="whisperInput" ref={(ref) => this.inputRef = ref} type="text" value={whisper} placeholder="Search" onChange={this.filterChange.bind(this)} />
          </div>
  			</form>
      </div>
		)
	}
}

function mapStateToProps(state) {
	return stateSelectorList(state);
}

const appConnect = connect(mapStateToProps)(Whisperer);
export default appConnect;
