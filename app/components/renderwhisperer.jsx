import React from 'react';
import RenderList from './renderlist.jsx';
import RenderLoading from './renderloading.jsx';
import RenderWhisperer from './renderwhisperer.jsx';
import { connect } from 'react-redux';
import { setFilter } from '../actions/actions.jsx';
import { stateSelectorList } from '../selectors/selectors.jsx';
import _ from 'lodash';
import './App.css'

class Whisperer extends React.Component{
	constructor(props){
		super(props);
		this.inputRef = null;
    this.whisper = [];
	}

  componentDidUpdate() {
    const filter = this.props.filter;
    this.whisper = this.props.hint.toJS().map(item => {
      return this.getWhisperLine([item.jmeno, item.prijmeni], filter);
    })
    console.log('****************', this.whisper)

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

  // getWhisperLine(whisper, filter) {
  //   if (whisper[0] !== '' && [...whisper[0]][0].toLowerCase() === filter) {
  //     let name = whisper[0];
  //     let lastName = whisper[1];
  //     name = [...name].slice(1, name.length).join('');
  //     return [name, lastName];
  //   } else if (whisper[1] !== '' && [...whisper[1]][0].toLowerCase() === filter) {
  //     let lastName = whisper[1];
  //     lastName = [...lastName].slice(1, lastName.length).join('');
  //     if (whisper[0] === '') {
  //       return [lastName];
  //     }else {
  //       return [lastName, whisper[0]];
  //     }
  //   }
  // }

	filterChange(e) {
		this.props.dispatch(setFilter(e.target.value));
    this.whisper = [];
    // if (this.props.hint.length === 0) {
    //   this.whisper = [];
    //   this.inputRef.value = this.props.filter;
    // }
	}

	render(){
		return (
      <div id="whisper">
  			<form role="formWhisperer">
  				<div>
  					<label className="labelWhisperer">Whisper for...</label>
  	          <input id="whisperInput" ref={(ref) => this.inputRef = ref} type="text" placeholder="Search" onChange={this.filterChange.bind(this)} />
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
