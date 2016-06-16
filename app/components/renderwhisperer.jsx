import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import RenderList from './renderlist.jsx';
import RenderLoading from './renderloading.jsx';
import RenderWhisperer from './renderwhisperer.jsx';
import { setFilter } from '../actions/actions.jsx';
import { stateSelectorList, stateSelectorFirstRecord } from '../selectors/selectors.jsx';
import './App.css'

class Whisperer extends React.Component{
	constructor(props){
		super(props);
    this.inputRef ='';
    this.whisper = this.props.filter;
    this.bool = true;
	}

  componentWillUpdate() {
    this.inputRef.value = this.props.filter;
  }

  componentDidUpdate() {
    if (this.bool) this.inputRef.setSelectionRange(this.props.filter.length, this.whisper.length);
    // console.log('sdshsfosdjfs',document.getElementById('whisperInput').value)
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
    this.inputRef.value = this.props.filter;
	}

  handleKeyDown(e) {
    if (e.keyCode === 8) {
      this.bool = false;
      console.log('pppp',this.whisper,[...this.whisper].slice(0,this.whisper.length-1).join(''))
      this.whisper = [...this.whisper].slice(0,this.whisper.length-1).join('');
    } else {
      this.bool = true;
    }
  }

	render() {
    let rest = '';
    if (this.props.hint.size > 0 && this.bool) {
      let pom = this.props.hint.toJS();
      rest = this.getWhisperLine([pom.jmeno, pom.prijmeni], this.props.filter).join(' ');
      this.whisper = this.props.filter + rest;
    }

		return (
      <div id="whisper">
  			<form role="formWhisperer">
  				<div>
  					<label className="labelWhisperer">Whisper for...</label>
  	          <input
                id="whisperInput" ref={(ref) => this.inputRef = ref}
                type="text"
                value={this.whisper}
                placeholder="Search"
                onKeyDown={this.handleKeyDown.bind(this)}
                onChange={this.filterChange.bind(this)}
              />
          </div>
  			</form>
      </div>
		)
	}
}

function mapStateToProps(state) {
  return stateSelectorFirstRecord(state)
}

const appConnect = connect(mapStateToProps)(Whisperer);
export default appConnect;
