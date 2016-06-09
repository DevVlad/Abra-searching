import React from 'react';
import { connect } from 'react-redux';
import { stateSelectorLoading } from '../selectors/selectors.jsx';


class Loading extends React.Component {

  render(){
    if (this.props.loading === true) {
      return (
        <h2>Loading...</h2>
      );
    } else return null;
  }

}

function mapStateToProps(state) {
  return stateSelectorLoading(state);
}
const appConnect = connect(mapStateToProps)(Loading)
export default appConnect;
