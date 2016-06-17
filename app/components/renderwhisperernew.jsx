import React from 'react';
import { connect } from 'react-redux';
import { setFilter } from '../actions/actions.jsx';
import { stateSelectorList } from '../selectors/selectors.jsx';
import './App.css'

class WhispererNew extends React.Component{
	constructor(props){
		super(props);
    this.list = [];
	}

  componentDidUpdate() {
    if (this.props.hint.size > 0) {
      let pom = this.props.hint.toJS().map(item => {
        return <div class="item" data-value={item.id}>{item.prijmeni, item.jmeno}</div>
      })
      this.list = pom;
    }
  }

	filterChange(e) {
    this.props.dispatch(setFilter(e.target.value));
	}

  handleLink() {
    console.log('prdel')
  }

	render() {

		return (
      <div id="whisperNew">
  			<form role="formWhispererNew">
  				<label className="labelWhispererNew">WhisperNew for...</label>
            <input
              type="text"
              placeholder="Search"
              onChange={this.filterChange.bind(this)}
            />
          <div id='whispererDisplay'>
            {this.props.hint.toJS().map(item=>{return <div onClick={this.handleLink.bind(this)}>{item.prijmeni} {item.jmeno}</div>})}
          </div>
  			</form>
      </div>
		)
	}
}

function mapStateToProps(state) {
  return stateSelectorList(state)
}

const appConnect = connect(mapStateToProps)(WhispererNew);
export default appConnect;
