import React from 'react';
import { connect } from 'react-redux';
import { setFilter } from '../actions/actions.jsx';
import { stateSelectorList } from '../selectors/selectors.jsx';
import { DropdownList } from 'react-widgets';

import './App.css'

// import 'react-widgets/lib/less/react-widgets.less';

class whisperWidgets extends React.Component{
	constructor(props){
		super(props);
	}

  handleOnChange() {
    console.log('prdel')
  }

	render() {

		return (
      <div id="whisperWidgets">
  			<h1>dfnsdofsdfo</h1>
        <input />
        <DropdownList
          data={['p','d']}
          onChange={this.handleOnChange()}
        />
      </div>
		)
	}
}

function mapStateToProps(state) {
  return stateSelectorList(state)
}

const appConnect = connect(mapStateToProps)(whisperWidgets);
export default appConnect;
