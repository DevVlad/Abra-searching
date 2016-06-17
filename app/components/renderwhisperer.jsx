import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { setFilter } from '../actions/actions.jsx';
import { stateSelectorFirstRecord } from '../selectors/selectors.jsx';
import './App.css'

class Whisperer extends React.Component{
	constructor(props){
		super(props);
    this.inputRef = '';
    this.whisper = this.props.filter;
    this.rest = '';
    this.backspaceBool = false;
	}

  componentDidUpdate() {
    if (this.backspaceBool === false) this.inputRef.setSelectionRange(this.props.filter.length, this.whisper.length);
    if (this.rest === '') {
      return
    } else {
      this.backspaceBool = false;
    }
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

  handleKeyDown(e) {
    if (e.keyCode === 8) {
      this.rest = '';
      this.whisper = this.props.filter;
      this.backspaceBool = true;
      this.setState({});
    } else if (e.keyCode === 46) {
      this.rest = '';
      this.whisper = this.props.filter;
      this.backspaceBool = true;
      this.setState({});
    } else {
      this.backspaceBool = false;
    }
  }

	render() {
    if (this.props.hint.size > 0 && this.backspaceBool === false) {
      let pom = this.props.hint.toJS();
      let filter = this.props.filter;
      this.rest = this.getWhisperLine([pom.jmeno, pom.prijmeni], filter).join(' ');
      this.whisper = filter + this.rest;
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
