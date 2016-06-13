import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import shortid from 'shortid';
import './App.css'

class ResultList extends React.Component {

	render() {
		let items = this.props.data.map((item, key) => {
					return (
						<li key={item.id}> <h4>{item.jmeno} {item.prijmeni}</h4> email: {item.email} mobil: {item.mobil} telefon: {item.tel}</li>
					);
		});
		console.log('itemy', items)
		return (
			<ReactCSSTransitionGroup component='ul' transitionName="anime" transitionEnterTimeout={5000} transitionLeaveTimeout={10}>
				{items}
			</ReactCSSTransitionGroup>
		);
		}
}

export default ResultList;
