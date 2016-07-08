import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';

import './App.css';

class Loading extends React.Component {
	constructor() {
		super();
		this.pulse = null;
	};

  componentDidUpdate() {
		if (this.pulse == null && this.loadRef != undefined) {
			this.pulse = () => {
				if (this.loadRef == undefined) {
					this.pulse = null;
				} else {
					$(this.loadRef).delay(200).fadeOut('slow').delay(50).fadeIn('slow', this.pulse);
				}
			};
			this.pulse();
		}
  };

  render(){
    if (this.props.loading) {
      return (
        <div id='loading' ref={(ref) => this.loadRef = ref}>
          <h2 >Loading...</h2>
        </div>
      );
    } else return null;
  };

};

export default Loading;
